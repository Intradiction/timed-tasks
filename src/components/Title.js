import { InputBase, Typography } from "@mui/material";
import { useState, useContext } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import storeApi from "../utils/storeApi";

function Title({title, listId}) {

    const [open, setOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const {updateListTitle} = useContext(storeApi);

    const handleOnChange = (e) => {
        setNewTitle(e.target.value);
    }

    const handleOnBlur = () => {
        updateListTitle(newTitle, listId);
        setOpen(false);
    }

    return (  
        <div>
            {open ? (
                <div>
                    <InputBase 
                        onChange={handleOnChange}
                        autoFocus
                        value={newTitle}
                        sx={{
                            marginLeft: 1
                        }}
                        variant='h5'
                        onBlur={handleOnBlur}
                    />
                </div>  
            ) : (
                <div style={{ display: 'flex' }}>                 
                    <Typography 
                        onClick={()=>setOpen(!open)} 
                        sx={{marginLeft: 1, flexGrow: 1, fontWeight: 'bold'}}
                        variant='h5'
                    >
                        {title}
                    </Typography>
                    <MoreHorizIcon/>
                </div>
            )}
        </div> 
    );
}

export default Title;