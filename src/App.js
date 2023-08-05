import React from 'react';
import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider  } from '@mui/material/styles';
import Wrapper from './components/Wrapper'
import TopBar from './components/TopBar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#32A852'
    }
  }
});

function App() {

  const [mousePos, setMousePos] = useState({});

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };
  
    window.addEventListener('mousemove', handleMouseMove);
  
    return () => {
      window.removeEventListener(
        'mousemove',
        handleMouseMove
      );
    };
  }, []);

  return ( 
    <div style={{scrollBehavior: 'auto'}}>
      <ThemeProvider theme={theme}>
        <TopBar/>
        {/* <div style={{position: 'fixed'}}>
          The mouse is at position{' '}
          <b>
            ({mousePos.x}, {mousePos.y})[{window.scrollY}, {window.scrollX}]
          </b>
          VV:{window.visualViewport.width} IW: {window.innerWidth} CW: {Math.max(
  document.body.scrollWidth, document.documentElement.scrollWidth,
  document.body.offsetWidth, document.documentElement.offsetWidth,
  document.body.clientWidth, document.documentElement.clientWidth
)}
        </div>        */}
        <Wrapper/>
      </ThemeProvider>
    </div>
   );
}

export default App;