import React, { useState } from "react";
import { Paper, CssBaseline, Button } from "@mui/material";
import Title from './Title'
import Card from './Card'
import InputContainer from "./Input/InputContainer";
import { Droppable } from "react-beautiful-dnd";
import { Constants } from '../constants';

function List({list}) {
    const [isActive, setIsActive] = useState(false);
    const listWidthWeb = 300;

    return ( 
        <div>
            <Paper 
                sx={{
                    width: listWidthWeb,
                    backgroundColor: Constants.LIST_COLOR,
                    marginLeft: 1,
                    marginTop: 2,
                }}>
                <CssBaseline/>
                <Title title={list.title} listId={list.id}/>
                <Button variant="contained" sx={{margin: 1}} onClick={()=>{setIsActive(true)}}>Start</Button>
                <Button variant="contained" sx={{margin: 1}} onClick={()=>{setIsActive(false)}}>Pause</Button>
                <Droppable droppableId={list.id}>
                    {(provided)=>(
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {list.cards.map((card, index) => (
                                <Card key={card.id} card={card} index={index} isListActive={isActive} listWidth={listWidthWeb} listId={list.id}/>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                    
                </Droppable>
                <InputContainer listId={list.id} type='card'/>
            </Paper>
            
        </div>
    );
}

export default List;