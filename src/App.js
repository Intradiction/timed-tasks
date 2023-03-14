import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import List from './components/List'
import store from './utils/store'
import StoreApi from './utils/storeApi';

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
      <div>
        {data.listIds.map((listId)=>{
          const list = data.lists[listId];
          return <List list={list} key={listId}/>
        })}
      </div>
    </StoreApi.Provider>
  );
}

export default App;
