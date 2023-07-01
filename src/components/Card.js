import { Paper, Typography } from "@mui/material"
import { Draggable } from "react-beautiful-dnd";

function Card({card, index}) {
    return ( 
        <Draggable draggableId={card.id} index={index}>
            {(provided)=>(
                <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
                    <Paper sx={{margin: 1}}>
                        <Typography sx={{margin: 1}}> {card.title} </Typography>
                    </Paper>
                </div>
            )}
        </Draggable>

     );
}

export default Card;