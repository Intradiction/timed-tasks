import React, { useState } from "react";
import { Paper, CssBaseline, Button } from "@mui/material";
import Title from './Title'
import Card from './Card'
import InputContainer from "./Input/InputContainer";
import { Droppable } from "react-beautiful-dnd";

function List({list}) {
    const [isActive, setIsActive] = useState(false);
    return ( 
        <div>
            <Paper 
                sx={{
                    width: 300,
                    backgroundColor: '#EBECF0',
                    marginLeft: 1,
                    marginTop: 2,
                }}>
                <CssBaseline/>
                <Title title={list.title} listId={list.id}/>
                <Button onClick={()=>{setIsActive(true)}}>Start</Button>
                <Button onClick={()=>{setIsActive(false)}}>Pause</Button>
                <Droppable droppableId={list.id}>
                    {(provided)=>(
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {list.cards.map((card, index) => (
                                <Card key={card.id} card={card} index={index} isListActive={isActive}/>
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