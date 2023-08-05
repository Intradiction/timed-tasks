import { useState, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import InputContainer from '../components/Input/InputContainer';
import List from './List'
import store from '../utils/store'
import StoreApi from '../utils/storeApi';
import { styled } from '@mui/system';
import { Button, Slide } from '@mui/material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Style } from '@mui/icons-material';
import DoneList from './DoneList';
import * as tweenFunctions from "tween-functions";
import { Constants } from '../constants';

const StyledDiv = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  background: '#32a852',
});

function Wrapper() {

  const [data, setData] = useState(store);
  const [doneListOpen, setDoneListOpen] = useState(true);

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
      // set the latest non-DoneList list that the card was in
      draggedCard.lastListId = destinationList.id;
      console.log('draggedCard now has lastListId: '+draggedCard.lastListId);
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

  const deleteCard = (targetCardId, sourceListId) => {
    const newSourceList = data.lists[sourceListId];
    newSourceList.cards = data.lists[sourceListId].cards.filter(card => card.id !== targetCardId);

    const newState = {
      ...data,
      lists:{
        ...data.lists,
        [sourceListId]: newSourceList,
      },
    };
    setData(newState);
  }
  /** Moves Card to the bottom of target List
   * 
   * @param {card} targetCard The card to be moved
   * @param {list.id} destListId The destination list ID
   * @param {list.id} sourceListId The source list ID
   */
  const moveCardToList = (targetCard, destListId, sourceListId) => {
    // first delete card from its current list
    const newSourceList = data.lists[sourceListId];
    newSourceList.cards = data.lists[sourceListId].cards.filter(card => card.id !== targetCard.id);

    const newState = {
      ...data,
      lists:{
        ...data.lists,
        [sourceListId]: newSourceList,
      },
    };
    setData(newState);

    // then add it to the dest list
    const list = data.lists[destListId];
    list.cards = [...list.cards, targetCard];

    const newState2 = {
      ...data,
      lists:{
        ...data.lists,
        [destListId]: list,
      },
    };
    setData(newState2);
    
  }

  
  return ( 
    <StoreApi.Provider value={{addMoreCard, addMoreList, updateListTitle, moveCardToList, deleteCard}}>
      <Button onClick={()=>{setDoneListOpen(!doneListOpen)}} fullWidth={true} variant='contained' color='info'>{doneListOpen ? 'Hide' : 'Show'} Done List</Button>
      <StyledDiv>
        
        <DragDropContext onDragEnd={onDragEnd}>
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
                    <Slide direction="left" in={doneListOpen} mountOnEnter unmountOnExit>
                      <div style={{position: 'fixed', right: 8}}>
                        <DoneList list={data.lists['list-done']} key='list-done'/>
                      </div>                
                    </Slide>
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
