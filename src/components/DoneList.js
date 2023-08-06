import React, { useState } from "react";
import { Paper, CssBaseline, Button } from "@mui/material";
import Title from './Title'
import Card from './Card'
import InputContainer from "./Input/InputContainer";
import { Droppable } from "react-beautiful-dnd";
import { Constants } from "../config/constants";

function DoneList({list}) {
    const [isActive, setIsActive] = useState(false);
    return ( 
        <div>
            <Paper 
                sx={{
                    width: 300,
                    backgroundColor: Constants.DONELIST_COLOR,
                    marginLeft: 1,
                    marginTop: '15px',
                }}>
                <CssBaseline/>
                <Title title={list.title} listId={list.id}/>
                <Droppable droppableId={list.id}>
                    {(provided)=>(
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {list.cards.map((card, index) => (
                                <Card key={card.id} card={card} index={index} isListActive={isActive} listId={list.id}/>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                    
                </Droppable>
            </Paper>
            
        </div>
    );
}

export default DoneList;