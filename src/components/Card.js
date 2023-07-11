import { InputBase, Paper, Typography } from "@mui/material"
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


    // if index changes, pause the new first card
    useEffect(()=>{
        console.log('loaded');
        pause();
        if(index === 0){
            resume();
        }
    }, [index])

    // // the timer is not paused by default, so we pause it on first load unless it's the first task
    // useEffect(()=>{
    //     console.log('loaded');
    //     pause();
    // }, [])

    // when parent list's isActive property changes
    useEffect(()=>{
        console.log(`isParentActive: ${isListActive}`);
        pause();

        if (index === 0 && isListActive){
            resume();
        } else if (index === 0 && !isListActive) {
            pause();
        }

    }, [isListActive])
    

    const handleOnChange = (e) => {
        setNewTitle(e.target.value);
    }

    const handleOnBlur = () => {
        card.title = newTitle;
        setOpen(false);
    }

    // resume if the card is first on the list
    const resumeIfFirst = () => {
        console.log(`index: ${index}`);

        if(index === 0){
            resume();
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
                            <div onClick={pause} onBlur={resumeIfFirst}>
                                <TimePicker 
                                    on
                                    value={dayjs(`${minutes}:${seconds}`, 'mm-ss')} 
                                    views={['minutes', 'seconds']} 
                                    format="mm:ss"
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
