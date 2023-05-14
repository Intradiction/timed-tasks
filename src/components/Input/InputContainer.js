import { Collapse, Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import InputCard from "./InputCard";

const StyledDiv = styled('div')({
    width: '280px',
    marginTop: '8px'
});

function InputContainer({ listId, type }) {

    const [open, setOpen] = useState(false)

    return ( 
    <StyledDiv>
        <Collapse in={open}>
            <InputCard setOpen={setOpen} listId={listId} type={type}/>
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

                
                    <Typography sx={{margin: 1,}}>{type === 'card' ? "+ Add a Card" : "+ Add a List"}</Typography>
            </Paper>        
        </Collapse>

    </StyledDiv> );
}

export default InputContainer;