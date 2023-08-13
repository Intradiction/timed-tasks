import React, { useContext } from "react";
import { Paper, CssBaseline, Button } from "@mui/material";
import { Droppable } from "react-beautiful-dnd";
import Title from './Title'
import Card from './Card'
import storeApi from "../utils/storeApi";
import { Constants } from "../config/constants";

function DoneList({list}) {
    const {moveCardToList} = useContext(storeApi);

    const handleReturnBtn = () => {
        for (let card of list.cards) {
            card.timeLeft = card.lastTimeSet;
            moveCardToList(card, card.lastListId, list.id);
        }
    }

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
                <Button variant="contained" sx={{margin: 1}} onClick={handleReturnBtn}>Return Cards</Button>
                <Droppable droppableId={list.id}>
                    {(provided)=>(
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {list.cards.map((card, index) => (
                                <Card key={card.id} card={card} index={index} isListActive={false} listId={list.id}/>
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