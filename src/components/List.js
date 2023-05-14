import React from "react";
import { Paper, CssBaseline } from "@mui/material";
import Title from './Title'
import Card from './Card'
import InputContainer from "./Input/InputContainer";

function List({list}) {
    return ( 
        <div>
            <Paper 
                sx={{
                    width: 300,
                    backgroundColor: '#EBECF0',
                    marginLeft: 1
                }}>
                <CssBaseline/>
                <Title title={list.title}/>
                {list.cards.map((card) => (
                    <Card key={card.id} card={card}/>
                ))}
                <InputContainer listId={list.id} type='card'/>
            </Paper>
            
        </div>
    );
}

export default List;