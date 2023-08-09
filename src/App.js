import React from 'react';
import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider  } from '@mui/material/styles';
import { AuthProvider } from './utils/AuthContext';
import { DatabaseProvider } from './utils/DatabaseContext';
import store from './utils/store';
import Wrapper from './components/Wrapper'
import TopBar from './components/TopBar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#32A852'
    },
    black: {
      main: '#000000'
    }
  }
});

function App() {
  
  const [data, setData] = useState(store);
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
      <AuthProvider>
      <DatabaseProvider>
        <ThemeProvider theme={theme}>
          <TopBar data={data} setData={setData}/>
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
          <Wrapper data={data} setData={setData}/>
        </ThemeProvider>
      </DatabaseProvider>
      </AuthProvider>
   );
}

export default App;