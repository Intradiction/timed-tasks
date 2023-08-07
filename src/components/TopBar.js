import React, { useEffect, useState } from 'react'
import { AppBar, Avatar, Button, Toolbar, Typography } from '@mui/material';
import { auth, googleProvider } from '../config/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from '@firebase/auth';
import { useAuth } from '../utils/AuthContext';

function TopBar() {

    const { loginWithGoogle, logout, currentUser } = useAuth();

    const handleLoginBtn = async () => {
        loginWithGoogle();
    }

    const handleLogoutBtn = async () => {
        logout();
    }

    return ( 
        <div>
            <AppBar>
                <Toolbar>
                    <Typography variant="h3" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Timed Tasks
                    </Typography>
                    <Avatar src={currentUser ? currentUser.photoURL : ""} alt="profile-pic" />
                    <Typography sx={{margin: 1}}>{currentUser ? currentUser.displayName : "Not Signed In"}</Typography>
                    { currentUser ? (
                        <Button onClick={handleLogoutBtn} variant='contained' color='black'>Logout</Button>
                    ) : (
                        <Button onClick={handleLoginBtn} variant='contained' color='black'>Sign In</Button>
                    )}

                </Toolbar>
            </AppBar>
            <Toolbar/>
        </div>
     );
}

export default TopBar;