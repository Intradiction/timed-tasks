import React, { useEffect, useState } from 'react'
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { auth, googleProvider } from '../config/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from '@firebase/auth';

function TopBar() {

    const [user, setUser] = useState({});

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        })
    }, []);

    const signInWIthGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
        } catch (error) {
            console.error(error);
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.error(error);
        }
    }

    return ( 
        <div>
            <AppBar>
                <Toolbar>
                    <Typography variant="h3" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Timed Tasks
                    </Typography>
                    <Button onClick={signInWIthGoogle} variant='contained' color='black'>Sign In</Button>
                    <Button onClick={logout} variant='contained' color='black'>Sign Out</Button>
                    <img src={user ? user.photoURL : ""} alt="profile-pic" />
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </div>
     );
}

export default TopBar;