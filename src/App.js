import React from 'react';
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
  return ( 
    <div>
      <ThemeProvider theme={theme}>
        <TopBar/>
        <Wrapper/>
      </ThemeProvider>
    </div>
   );
}

export default App;