import React, { useState, useContext } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Paper, CssBaseline, Button } from "@mui/material";
import InputContainer from "./Input/InputContainer";
import { Constants } from '../config/constants';
import storeApi from "../utils/storeApi";
import Title from './Title'
import Card from './Card'

function List({list}) {
    const {updateDb} = useContext(storeApi);
    const [isActive, setIsActive] = useState(false);
    const listWidthWeb = 300;

    const handleStartBtn = async () => {
        setIsActive(true);
        await updateDb();
    }

    const handlePauseBtn = async () => {
        setIsActive(false);
        await updateDb();
    }

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
                <Button variant="contained" sx={{margin: 1}} onClick={handleStartBtn}>Start</Button>
                <Button variant="contained" sx={{margin: 1}} onClick={handlePauseBtn}>Pause</Button>
                <Droppable droppableId={list.id}>
                    {(provided)=>(
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {list.cards.map((card, index) => (
                                <Card 
                                    key={card.id} 
                                    card={card} 
                                    index={index} 
                                    isListActive={isActive} 
                                    listWidth={listWidthWeb} 
                                    listId={list.id}
                                    updateDb={updateDb}/>
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