import { Paper, InputBase, Button, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear"
import { useState } from "react";

function InputCard({setOpen}) {

    const [cardTitle, setCardTitle] = useState(null);
    const handleOnChange = (e) => {};

    return ( 
        <div>
            <div>
                <Paper sx={{margin: 1}}>
                    <InputBase 
                        sx={{margin: 1}} 
                        onChange={handleOnChange} 
                        multiline 
                        fullWidth
                        vale={cardTitle} 
                        placeholder="enter card title"
                    />
                </Paper>
            </div>
            <div>
                <Button onClick={() => setOpen(false)}>Add Card</Button>
                <IconButton onClick={() => setOpen(false)}>
                    <ClearIcon/>
                </IconButton>
            </div>
        </div>
     );
}

export default InputCard;