import { useState } from 'react'
import List from './components/List'
import store from './utils/store'

function App() {

  const [data, setData] = useState(store);

  return (
    <div>
      {data.listIds.map((listId)=>{
        const list = data.lists[listId];
        return <List list={list} key={listId}/>
      })}
      
    </div>
  );
}

export default App;
