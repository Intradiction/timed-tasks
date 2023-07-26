import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import InputContainer from '../components/Input/InputContainer';
import List from './List'
import store from '../utils/store'
import StoreApi from '../utils/storeApi';
import { styled } from '@mui/system';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Style } from '@mui/icons-material';

const StyledDiv = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  background: '#32a852',
});

function Wrapper() {

  const [data, setData] = useState(store);
  const addMoreCard = (title, listId) => {
    console.log("Adding new card with \ntitle: "+title+"\nlistId: "+listId+"\n");
    const newCardId = uuid();
    const newCard = {
      id: newCardId,
      title,
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
      listIds: [...data.listIds, newListId],
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
    console.log('destination:', destination, '\nsource:', source, '\ndraggableId', draggableId)

    const sourceList = data.lists[source.droppableId];
    const destinationList = data.lists[destination.droppableId];
    const draggedCard = sourceList.cards.filter((card) => card.id === draggableId)[0];

    // if the destination is null or list is being dragged
    if (destination == null || type === 'list') {
      return;
    } 
    // else if intralist dropping
    else if (source.droppableId === destination.droppableId) {
      console.log('intralist dropping');
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
      console.log('interlist dropping')
      console.log('type: '+type)
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

  return ( 
    <StoreApi.Provider value={{addMoreCard, addMoreList, updateListTitle}}>
        <StyledDiv>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='app' type='list'>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <StyledDiv>
                {data.listIds.map((listId)=>{
                  const list = data.lists[listId];
                  return <List list={list} key={listId}/>
                })}
                <InputContainer type="list"/> 
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
