import React, { useEffect } from 'react';
import { useState } from 'react';
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

  // User has switched back to the tab
  const onFocus = () => {
    console.log("Tab is in focus");
  };

  // User has switched away from the tab (AKA tab is hidden)
  const onBlur = () => {
    console.log("Tab is blurred");
  };

    useEffect(() => {
        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);
        // Calls onFocus when the window first loads
        onFocus();
        // Specify how to clean up after this effect:
        return () => {
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("blur", onBlur);
        };
    });


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