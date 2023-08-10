import React, { useContext, useEffect, useState } from 'react';
import  { auth, googleProvider }  from '../config/firebase'
import { signInWithPopup, signOut } from '@firebase/auth';

const AuthContext = React.createContext();

function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    // function signup(email, password) {
    //     return auth.createUserWithEmailAndPassword(email, password);
    // }

    async function loginWithGoogle() {
      try {
        await signInWithPopup(auth, googleProvider)
      } catch (error) {
        console.error(error);
      }
    }

    async function logout() {
      try {
        await signOut(auth)
      } catch (error) {
        console.error(error);
      }
    }

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        })
        return unsub;
    }, [])
    
    const value = {
        currentUser,
        //signup,
        loginWithGoogle,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export {AuthContext, useAuth, AuthProvider} ;