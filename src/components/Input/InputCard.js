import { Paper, InputBase, Button, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear"
import { useContext, useState } from "react";
import StoreApi from "../../utils/storeApi";

function InputCard({setOpen, listId, type}) {

    const [title, setCardTitle] = useState('');
    const { addMoreCard } = useContext(StoreApi);

    const handleOnChange = (e) => {
        setCardTitle(e.target.value.toString());
        console.log(title);
    };
    function handleBtnConfirm () {
        if(type === 'card') {
            console.log("handlingbtnconfirm, title: "+title);
            addMoreCard(title, listId);
            setCardTitle('');
            setOpen(false);
        } else {
            //addMoreList(title);
        }
            
    }
    const handleBtnX = () => {
        setOpen(false);
        setCardTitle('');   
    }
    const handleOnBlur = () => {
        //setOpen(false);
        //setCardTitle('');
    }

    return ( 
        <div>
            <div>
                <Paper sx={{margin: 1}}>
                    <InputBase 
                        sx={{margin: 1}} 
                        onChange={handleOnChange}
                        onBlur={handleOnBlur} 
                        multiline 
                        fullWidth
                        value={title} 
                        placeholder={type === 'card' ? "enter card title" : "enter list title"}
                    />
                </Paper>
            </div>
            <div>
                <Button onClick={handleBtnConfirm}>{type === 'card' ? "Add Card" : "Add List"}</Button>
                <IconButton onClick={handleBtnX}>
                    <ClearIcon />
                </IconButton>
            </div>
        </div>
     );
}

export default InputCard;