import { Button, InputBase, Paper, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useTimer } from 'react-timer-hook';
import { TimePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

function Card({card, index, isListActive}) {
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
        card.timeLeft = {
            minutes: minutes,
            seconds: seconds
        }
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
 
    const handleOnAccept = () => {
        console.log('accepted')
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
                                    onSelectedSectionsChange={handleOnSSChange}
                                    onAccept={handleOnAccept}
                                    onChange={handleTPChange}
                                    sx={{
                                        width: "100%"
                                    }}
                                />
                            </div>                  
                        </LocalizationProvider>
                    </Paper>
                </div>
            )}
        </Draggable>
 
     );
}
 
export default Card;
 