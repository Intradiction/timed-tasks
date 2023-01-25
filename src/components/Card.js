import { Paper, Typography } from "@mui/material"

function Card({card}) {
    return ( 
        <div>
            <Paper sx={{margin: 1}}>
                <Typography sx={{margin: 1}}> {card.content} </Typography>
            </Paper>
        </div>
     );
}

export default Card;