import React from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material';

function TopBar() {
    return ( 
        <div>
            <AppBar>
                <Toolbar>
                    <Typography variant="h3" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Timed Tasks
                    </Typography>
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </div>
     );
}

export default TopBar;