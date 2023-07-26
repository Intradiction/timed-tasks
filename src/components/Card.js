import { Button, InputBase, Paper, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useTimer } from 'react-timer-hook';
import { TimePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

// TODO: FIX interlist dropping resetting card time left to 5:00 

function Card({card, index, isListActive}) {
    const [open, setOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(card.title);
 
    const time = new Date();
    time.setSeconds(time.getSeconds() + 300);
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
    } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called')})
 
    const [timeLeft, setTimeLeft] = useState(dayjs(`${minutes}:${seconds}`, 'mm-ss'));
    
 
    // resume if this card is first in list AND the list is active
    const resumeIfSlated = () => {
        if(index === 0 && isListActive){
            start();
            pause()
            resume();
            console.log('resumed')
        }        
    }
 
    useEffect(()=>{
        setTimeLeft(dayjs(`${minutes}:${seconds}`, 'mm-ss'));
    }, [seconds])
 
    // if index changes, pause all cards, then resume the new first card if list active
    useEffect(()=>{
        console.log('index changed');
        pause();
        resumeIfSlated();
    }, [index])
 
    // when parent list's isActive property changes
    useEffect(()=>{
        console.log('isActive changed')
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
 
    const handleOnAccept = (value) => {
        console.log('accepted')
        // const time = new Date();
        // time.setSeconds(time.getSeconds() + value.$s);
        // time.setMinutes(time.getMinutes() + value.$m);
        // restart(time, false);
        resumeIfSlated();
    }
 
    const handleOnTPClose = () => {
        console.log(`TP closed at index ${index}, isListActive: ${isListActive}`);
        resumeIfSlated();
    }
 
    const handleOnTPBlur = (event) => {
        console.log(event);
        if (event.relatedTarget === null) {
            console.log('outside was actually clicked');
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
 
    const debugLog = () => {
        console.log(`${minutes}:${seconds}`);
        console.log(isRunning);
    }
 
    return ( 
        <Draggable draggableId={card.id} index={index}>
            {(provided)=>(
                <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps} style={{
                    padding: 1,
                    margin: "0 0 -8px 0",
                    borderRadius: "2px",
                    ...provided.draggableProps.style,
                  }}>
                    <Paper sx={{margin: 1}}>
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
                                    //onOpen={()=>{console.log('div onclick'); pause()}}
                                    onSelectedSectionsChange={handleOnSSChange}
                                    onAccept={handleOnAccept}
                                    onChange={handleTPChange}
                                    //onClose={handleOnTPClose}
                                    sx={{
                                        width: "100%"
                                    }}
                                />
                            </div>                  
                        </LocalizationProvider>
                       <button onClick={debugLog}>Debug</button>
                       <button onClick={()=>{resume()}}>Resume</button>
                    </Paper>
                </div>
            )}
        </Draggable>
 
     );
}
 
export default Card;
 