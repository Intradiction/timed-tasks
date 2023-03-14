import { Paper, InputBase, Button, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear"
import { useContext, useState } from "react";
import StoreApi from "../../utils/storeApi";

function InputCard({setOpen, listId}) {

    const [cardTitle, setCardTitle] = useState('');
    const { addMoreCard } = useContext(StoreApi);

    const handleOnChange = (e) => {
        setCardTitle(e.target.value.toString());
        console.log(cardTitle);
    };
    function handleBtnConfirm (){
        console.log("handlingbtnconfirm, title: "+cardTitle);
        addMoreCard(cardTitle, listId);
        setCardTitle('');
        setOpen(false);
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
                        value={cardTitle} 
                        placeholder="enter card title"
                    />
                </Paper>
            </div>
            <div>
                <Button onClick={handleBtnConfirm}>Add Card</Button>
                <IconButton onClick={() => setOpen(false)}>
                    <ClearIcon />
                </IconButton>
            </div>
        </div>
     );
}

export default InputCard;