import { Button, InputBase, Paper, Typography, Menu, MenuItem } from "@mui/material"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext, useEffect, useState, useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useTimer } from 'react-timer-hook';
import { TimePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import StoreApi from "../utils/storeApi";
import { borderRadius, maxHeight } from "@mui/system";

function Card({card, index, isListActive, listWidth, listId}) {
    const {moveCardToList, deleteCard, updateCardTimeLeft} = useContext(StoreApi);
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
        setTimeLeft(dayjs(`${minutes}:${seconds}`, 'mm-ss'));
        //updateCardTimeLeft(card.id, listId, card.timeLeft);
    }, [seconds])
 
    // if index changes, pause all cards, then resume the new first card if list active
    useEffect(()=>{
        //console.log('index changed');
        pause();
        resumeIfSlated();
    }, [index])
 
    // when parent list's isActive property changes
    useEffect(()=>{
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
        const newTime = new Date();
        newTime.setSeconds(newTime.getSeconds() + value.$s);
        newTime.setMinutes(newTime.getMinutes() + value.$m);
        restart(newTime, false);
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

    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleDoneBtn = () => {
        handleClose();
        handleMoveToDone();
    }

    const handleDelBtn = () => {
        handleClose();
        deleteCard(card.id, listId);
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
                        <div style={{display: 'flex'}}>
                        {open ? (
                            <InputBase 
                                onChange={handleOnChange}
                                
                                value={newTitle}
                                sx={{
                                    margin: 1,
                                    flex: 1,
                                    maxHeight: '24px',
                                }}
                                variant='h5'
                                onBlur={handleOnBlur}/>
                        ) : (
                            <Typography sx={{margin: 1, flex: 1}} onClick={()=>setOpen(!open)} > {card.title} </Typography>
                        )}
                            <Button
                                id="demo-positioned-button"
                                aria-controls={open ? 'demo-positioned-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}                                
                            >
                                <MoreHorizIcon color="black"/>
                            </Button>
                            <Menu
                                id="demo-positioned-menu"
                                aria-labelledby="demo-positioned-button"
                                anchorEl={anchorEl}
                                open={menuOpen}
                                onClose={handleClose}
                                anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                                }}
                                disableScrollLock={true} // IMPORTANT!!! If the scrollbar is disabled onOpen the DoneList is messed up
                            >
                                <MenuItem onClick={handleDoneBtn}><DoneIcon/></MenuItem>
                                <MenuItem onClick={handleDelBtn}><DeleteIcon/></MenuItem>
                            </Menu>
                        </div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div  onBlur={handleOnTPBlur}>
                                <TimePicker 
                                    value={dayjs(`${card.timeLeft.minutes}:${card.timeLeft.seconds}`, 'mm-ss')} 
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
 