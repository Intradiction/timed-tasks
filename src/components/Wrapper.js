import { useState, useRef, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import InputContainer from '../components/Input/InputContainer';
import List from './List'
import store from '../utils/store'
import StoreApi from '../utils/storeApi';
import { styled } from '@mui/system';
import { Backdrop, Button, CircularProgress, Slide } from '@mui/material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Style } from '@mui/icons-material';
import DoneList from './DoneList';
import * as tweenFunctions from "tween-functions";
import { Constants } from '../config/constants';
import { useAuth } from '../utils/AuthContext';
import { db }  from '../config/firebase'
import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore"; 


const StyledDiv = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  background: '#32a852',
});

function Wrapper() {

  const {currentUser} = useAuth();

  const [data, setData] = useState(store);
  const [loaded, setLoaded] = useState(false);
  const [doneListOpen, setDoneListOpen] = useState(true);

  // load data from firestore again on currentUser Change
  useEffect(() => {
    if (!currentUser){
      setLoaded(true);
      return;
    }
    const getData = async () => {
      console.log(currentUser);
      const docRef = doc(db, "tasksCollection", currentUser.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        updateTasksDB(docSnap.data());
        setLoaded(true);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    getData();
  }, [currentUser]);

  async function updateTasksDB(data) {
    setData(data);
    try {
      await setDoc(doc(db, "tasksCollection", currentUser.email), data); 
    } catch (e) {
      console.error("Error adding document: ", e);
    }       
}

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
    updateTasksDB(newState);
  }

  const updateCardTimeLeft = (targetCardId, sourceListId, timeLeft) => {
    const newLists = data.lists;
    const targetCard = newLists[sourceListId].cards.find(card => card.id == targetCardId);
    targetCard.timeLeft = timeLeft;

    const newState = {
      ...data,
      lists:{
        ...newLists
      },
    };
    updateTasksDB(newState);
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
    updateTasksDB(newState);
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
    updateTasksDB(newState);

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
    updateTasksDB(newState2);
    
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
    updateTasksDB(newState);
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
    updateTasksDB(newState);
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
      updateTasksDB(newState);
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
      updateTasksDB(newState);
    }
  }

  // save data to firestore on tab refresh or close
  useEffect(() => {
    const handleTabClose = event => {
      event.preventDefault();

      console.log('beforeunload event triggered');
      try {
        setDoc(doc(db, "tasksCollection", currentUser.email), data); 
      } catch (e) {
        console.error("Error adding document: ", e);
      }      
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  });

  return ( 
    <StoreApi.Provider value={{addMoreCard, addMoreList, updateListTitle, moveCardToList, deleteCard, updateCardTimeLeft}}>
      {loaded ? (
        <div>
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
        </div>
      ) : (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </StoreApi.Provider>
  );
}

export default Wrapper;
