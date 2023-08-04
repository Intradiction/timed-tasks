import { useState, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import InputContainer from '../components/Input/InputContainer';
import List from './List'
import store from '../utils/store'
import StoreApi from '../utils/storeApi';
import { styled } from '@mui/system';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Style } from '@mui/icons-material';
import DoneList from './DoneList';
import * as tweenFunctions from "tween-functions";

const StyledDiv = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  background: '#32a852',
});

function Wrapper() {

  const [data, setData] = useState(store);

  const addMoreCard = (title, listId, timeLeft) => {
    console.log("Adding new card with \ntitle: "+title+"\nlistId: "+listId+"\n");
    console.log("timeLeft:" +JSON.stringify(timeLeft));
    const newCardId = uuid();
    const newCard = {
      id: newCardId,
      title,
      timeLeft: timeLeft,
    };

    const list = data.lists[listId];
    list.cards = [...list.cards, newCard];

    const newState = {
      ...data,
      lists:{
        ...data.lists,
        [listId]: list,
      },
    };
    setData(newState);

  }

  const addMoreList = (title) => {
    const newListId = uuid();
    const newList = {
      id: newListId,
      title,
      cards: [],
    };

    const newState = {
      listIds: data.listIds.toSpliced(data.listIds.length-1, 0, newListId),
      lists: {
        ...data.lists,
        [newListId]: newList
      }
    }
    setData(newState);
  };

  const updateListTitle = (title, listId) => {
    const list = data.lists[listId];
    list.title = title;

    const newState = {
      ...data,
      lists:{
        ...data.lists,
        [listId]: list
      }
    }
    setData(newState);
    console.log(`updating list with id = ${listId} to new title = ${title}`);
  }

  const onDragEnd = (result) => {
    const {destination, source, draggableId, type} = result;
    //console.log('draggableID:'+draggableId)
    //console.log('destination:', destination, '\nsource:', source, '\ndraggableId', draggableId)

    const sourceList = data.lists[source.droppableId];
    const destinationList = data.lists[destination.droppableId];
    const draggedCard = sourceList.cards.filter((card) => card.id === draggableId)[0];

    // if the destination is null or list is being dragged
    if (destination == null || type === 'list') {
      return;
    } 
    // else if intralist dropping
    else if (source.droppableId === destination.droppableId) {
      //console.log('intralist dropping');
      sourceList.cards.splice(source.index, 1);
      destinationList.cards.splice(destination.index, 0, draggedCard);
      const newState = {
        ...data,
        lists: {
          ...data.lists,
          [sourceList.id]: destinationList, 
        }
      }
      setData(newState);
    }
    // else interlist dropping
    else {
      //console.log('interlist dropping')
      //console.log('type: '+type)
      sourceList.cards.splice(source.index, 1);
      destinationList.cards.splice(destination.index, 0, draggedCard);
      const newState = {
        ...data,
        lists: {
          ...data.lists,
          [sourceList.id]: sourceList, 
          [destinationList.id]: destinationList, 
        }
      }
      setData(newState);
    }
  }

  let api;
  const useMyCoolSensor = value => {
    api = value;
  };

  const useSnapSensor = value => {
    api = value;
  };

  const snapToDone = function start() {
    const preDrag = api.tryGetLock("card-1");

    if (!preDrag) {
      return;
    }
    console.log('not returend')
    const drag = preDrag.snapLift(start);

    drag.moveRight();
    drag.drop();
  }

  const moveToDone = function start(cardProps, listProps) {
    const preDrag = api.tryGetLock(cardProps.id);

    if (!preDrag) {
      return;
    }

    const endX = doneListRef.current.offsetLeft, endY = doneListRef.current.offsetTop;

    // The offsets take into account the card's position, as well as any window scroll
    const listIndex = data.listIds.indexOf(listProps.id);
    console.log('list index for moveToDone: '+listIndex)
    const offsetY = 2*cardProps.height+(cardProps.height*cardProps.index)-window.scrollY, offsetX = listProps.width*listIndex+(Math.max(
      document.body.scrollWidth, document.documentElement.scrollWidth,
      document.body.offsetWidth, document.documentElement.offsetWidth,
      document.body.clientWidth, document.documentElement.clientWidth
    )-document.body.clientWidth); 
    const start = { x: 0, y: 0 }; 
    const end = { x: endX-offsetX, y: endY-offsetY };
    const drag = preDrag.fluidLift(start);

    const points = [];

    const numberOfPoints = 100;

    for (let i = 0; i < numberOfPoints; i++) {
      points.push({
        x: tweenFunctions.easeOutSine(i, start.x, end.x, numberOfPoints),
        y: tweenFunctions.easeOutSine(i, start.y, end.y, numberOfPoints)
      });
    }
    moveStepByStep(drag, points);
  }

  function moveStepByStep(drag, values) {
    requestAnimationFrame(() => {
      const newPosition = values.shift();
      console.log(`newX: ${newPosition.x}, newY: ${newPosition.y}`);
      drag.move(newPosition);
  
      if (values.length) {
        moveStepByStep(drag, values);
      } else {
        //drag.drop();
      }
    });
  }

  const doneListRef = useRef(null);

  return ( 
    <StoreApi.Provider value={{addMoreCard, addMoreList, updateListTitle, moveToDone}}>
      <StyledDiv>
        <DragDropContext sensors={[useMyCoolSensor, useSnapSensor]} onDragEnd={onDragEnd}>
          <Droppable droppableId='app' type='list'>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <StyledDiv>
                  {/* <button onClick={snapToDone}>snap</button> */}
                  {data.listIds.filter(listId => listId !== 'list-done').map((listId)=>{
                    const list = data.lists[listId];
                    return <List list={list} key={listId}/>
                  })}
                  <InputContainer type="list"/> 
                  <div style={{backgroundColor: 'none'}} className="bruh" ref={doneListRef}>
                    <DoneList list={data.lists['list-done']} key='list-done'/>
                  </div>
                  {provided.placeholder}      
                </StyledDiv>      
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </StyledDiv>
    </StoreApi.Provider>
  );
}

export default Wrapper;
