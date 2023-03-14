import { Collapse, Paper, Typography } from "@mui/material";
import { useState } from "react";
import InputCard from "./InputCard";

function InputContainer({ listId }) {

    const [open, setOpen] = useState(false)

    return ( <div>
        <Collapse in={open}>
            <InputCard setOpen={setOpen} listId={listId}/>
        </Collapse>
        <Collapse in={!open}>
            <Paper sx={{
                    margin: 1,
                    background: '#EBECF0',
                    boxShadow: "none",
                    "&:hover": {
                        background: '#98A9AD',
                        cursor: 'pointer'
                    }
                }} onClick={()=> setOpen(!open)}>

                
                    <Typography sx={{margin: 1,}}>+ Add a Card</Typography>
            </Paper>        
        </Collapse>

    </div> );
}

export default InputContainer;