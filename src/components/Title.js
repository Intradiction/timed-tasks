import { InputBase, Typography } from "@mui/material";
import { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"

function Title({title}) {
    const [open, setOpen] = useState(false);
    return (  
        <div>
            {open ? (
                <div>
                    <InputBase 
                        value={title}
                        sx={{
                            marginLeft: 1
                        }}
                        onBlur={()=> setOpen(!open)}
                        />
                    
                </div>
                
            ) : (
                <div style={{ display: 'flex' }}>                 
                    <Typography onClick={()=>setOpen(!open)} sx={{marginLeft: 1, flexGrow: 1}}>{title}</Typography>
                    <MoreHorizIcon/>
                </div>
            )}
            
            
        </div>
    );
}

export default Title;