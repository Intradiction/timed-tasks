import { Button, InputBase, Paper, Typography } from "@mui/material"
import { useContext, useEffect, useState, useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useTimer } from 'react-timer-hook';
import { TimePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import StoreApi from "../utils/storeApi";
import { borderRadius } from "@mui/system";

function Card({card, index, isListActive, listWidth, listId}) {
    const {moveCardToList} = useContext(StoreApi);
    const [open, setOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(card.title);
 
    const time = new Date();
    time.setSeconds(time.getSeconds() + card.timeLeft.seconds);
    time.setMinutes(time.getMinutes() + card.timeLeft.minutes);
    let expiryTimestamp = time;
    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({ expiryTimestamp, onExpire: () => {
        handleMoveToDone();
    }})
 
    const [timeLeft, setTimeLeft] = useState(dayjs(`${minutes}:${seconds}`, 'mm-ss'));
    
    // resume if this card is first in list AND the list is active
    const resumeIfSlated = () => {
        if(index === 0 && isListActive){

            resume();
            //console.log('resumed')
        }        
    }
 
    useEffect(()=>{
        card.timeLeft = {
            minutes: minutes,
            seconds: seconds
        }
    }, [seconds])
 
    // if index changes, pause all cards, then resume the new first card if list active
    useEffect(()=>{
        //console.log('index changed');
        pause();
        resumeIfSlated();
    }, [index])
 
    // when parent list's isActive property changes
    useEffect(()=>{
        //console.log('isActive changed')
        pause();
        resumeIfSlated();
    }, [isListActive])
 
    const handleOnChange = (e) => {
        setNewTitle(e.target.value);
    }
 
    const handleOnBlur = () => {
        card.title = newTitle;
        setOpen(false);
    }
 
    const handleTPChange = (value) => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + value.$s);
        time.setMinutes(time.getMinutes() + value.$m);
        restart(time, false);
        console.log('pausing')
    }
 
    const handleOnAccept = () => {
        console.log('accepted')
        resumeIfSlated();
    }
 
    const handleOnTPBlur = (event) => {
        console.log(event);
        if (event.relatedTarget === null) {
            //console.log('outside was actually clicked');
            resumeIfSlated();
        }
    }
 
    const handleOnSSChange = (value) => {
        if (value !== null){
            pause();
        } else {
            resumeIfSlated();
        }
    }
    
    const cardPaperRef = useRef(null);
    const padding = 1, marginBottom = 8, borderRadius = 2;

    const handleMoveToDone = () => { 
        card.timeLeft.seconds = 0; 
        moveCardToList(card, 'list-done', listId);
    }

    return ( 
        <Draggable draggableId={card.id} index={index}>
            {(provided)=>(
                <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps} style={{
                    padding, 
                    margin: "0 0 -"+marginBottom+"px 0",
                    borderRadius: borderRadius+"px",
                    ...provided.draggableProps.style,
                  }}>
                    <Paper ref={cardPaperRef} sx={{margin: 1}} elevation={4}>
                        {open ? (
                            <InputBase 
                                onChange={handleOnChange}
                                autoFocus
                                value={newTitle}
                                sx={{
                                    marginLeft: 1
                                }}
                                variant='h5'
                                onBlur={handleOnBlur}/>
                        ) : (
                            <Typography sx={{margin: 1}} onClick={()=>setOpen(!open)} > {card.title} </Typography>
                        )}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div  onBlur={handleOnTPBlur}>
                                <TimePicker 
                                    value={dayjs(`${minutes}:${seconds}`, 'mm-ss')} 
                                    views={['minutes', 'seconds']} 
                                    format="mm:ss"
                                    onSelectedSectionsChange={handleOnSSChange}
                                    onAccept={handleOnAccept}
                                    onChange={handleTPChange}
                                    sx={{
                                        width: "100%"
                                    }}
                                />
                            </div>                  
                        </LocalizationProvider>
                        <button onClick={handleMoveToDone}>move to done</button>
                    </Paper>
                </div>
            )}
        </Draggable>
 
     );
}
 
export default Card;
 