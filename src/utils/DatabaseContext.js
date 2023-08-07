import React, { useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from '@firebase/firestore';

const DatabaseContext = React.createContext();

function useDatabase() {
  return useContext(DatabaseContext);
}

function DatabaseProvider({ children }) {
  // writes the given data to the currentUser's doc
  async function updateTasksDb(data, currentUser) {
    try {
      await setDoc(doc(db, "tasksCollection", currentUser.email), data); 
    } catch (e) {
      console.error("Error adding document: ", e);
    }       
  }

  // fetches the data of given user
  async function readTasksDb (currentUser) {
    
    if (currentUser === null) {
      console.error('ERROR: readTasksDb() received a null currentUser object')
      return null;
    }

    try {
      const docRef = doc(db, "tasksCollection", currentUser.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Document data:", data);
        return data;
      } else {
        console.log('Document does not exist, is this a first time user?')
        return undefined;
      }
        
      
    } catch (e) {
      console.error(e);
      return null;
    }

  };

  const value = {
    updateTasksDb,
    readTasksDb,
  }

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}

export { DatabaseContext, useDatabase, DatabaseProvider };