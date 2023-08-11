import React from 'react'
import { AppBar, Avatar, Button, Toolbar, Typography } from '@mui/material';
import { useAuth } from '../utils/AuthContext';
import { useDatabase } from '../utils/DatabaseContext';

function TopBar({data, setData}) {

    const { loginWithGoogle, logout, currentUser } = useAuth();
    const { updateTasksDb } = useDatabase(); 

    const handleLoginBtn = async () => {
        loginWithGoogle();
    }

    const handleLogoutBtn = async () => {
        await updateTasksDb(data, currentUser);
        // set to blank after logging out
        setData({
            lists: {
                'list-done': {
                    id: 'list-done',
                    title: 'Done',
                    cards: []
                },        
            },
            listIds: ['list-done'],
        })
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