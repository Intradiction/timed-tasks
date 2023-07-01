import React from 'react'
import { AppBar } from '@mui/material';

function TopBar() {
    return ( 
        <div>
            <AppBar position='static' color="primary" elevation={0}>
                <h1>What Are Doing</h1>
            </AppBar>
        </div>
     );
}

export default TopBar;