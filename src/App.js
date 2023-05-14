import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import InputContainer from './components/Input/InputContainer';
import List from './components/List'
import store from './utils/store'
import StoreApi from './utils/storeApi';
import { styled } from '@mui/system';

const StyledDiv = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  background: '#32a852',
});

function App() {

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

  return ( 
    <StoreApi.Provider value={{addMoreCard}}>
      <StyledDiv>
        {data.listIds.map((listId)=>{
          const list = data.lists[listId];
          return <List list={list} key={listId}/>
        })}
        <InputContainer type="list"/>
      </StyledDiv>
    </StoreApi.Provider>
  );
}

export default App;
