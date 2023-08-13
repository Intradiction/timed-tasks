
import { useState, useContext } from "react";
import { InputBase, Typography, Menu, MenuItem, Button } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import DeleteIcon from '@mui/icons-material/Delete';
import storeApi from "../utils/storeApi";

function Title({title, listId}) {

    const [open, setOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const {updateListTitle, deleteList} = useContext(storeApi);

    const isNotDoneList = listId === 'list-done' ? false : true;
    const handleOnClick = () => {
        if (isNotDoneList) {
            setOpen(!open);
        }
    }

    const handleOnChange = (e) => {
        setNewTitle(e.target.value);
    }

    const handleOnBlur = () => {
        updateListTitle(newTitle, listId);
        setOpen(false);
    }

    const handleDelBtn = () => {
        deleteList(listId);
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (  
        <div>
            {open ? (
                <div>
                    <InputBase 
                        onChange={handleOnChange}
                        value={newTitle}
                        sx={{marginLeft: 1, marginTop: '4px', marginBottom: '4px', flexGrow: 1, fontWeight: 'bold', fontSize: '23.28px'}}
                        spellcheck="false"
                        onBlur={handleOnBlur}
                        autoFocus
                    />
                </div>  
            ) : (
                <div style={{ display: 'flex' }}>                 
                    <Typography 
                        onClick={handleOnClick} 
                        sx={{marginLeft: 1, marginTop: 1, flexGrow: 1, fontWeight: 'bold', height: '42.58px', outline: `0 solid transparent`}}
                        variant='h5'
                    >
                        {title}
                    </Typography>
                
                { isNotDoneList && <Button
                    id="demo-positioned-button"
                    aria-controls={menuOpen ? 'demo-positioned-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={menuOpen ? 'true' : undefined}
                    onClick={handleClick}                                
                >
                    <MoreHorizIcon color="black"/>
                </Button> }
                
                <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleClose}
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                    }}
                    disableScrollLock={true} // IMPORTANT!!! If the scrollbar is disabled onOpen the DoneList is messed up
                >
                    <MenuItem onClick={handleDelBtn}><DeleteIcon/></MenuItem>
                </Menu>
                </div>
            )}
        </div> 
    );
}

export default Title;