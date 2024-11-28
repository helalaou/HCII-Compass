import React, { useState } from 'react';
import './App.css';
import { Container, Box, Typography } from '@mui/material';
import SettingsGear from './components/SettingsGear';
import ChatInterface from './components/ChatInterface';
import { useChatLogic } from './hooks/useChatLogic';
import logo from './logo.png';

function App() {
  const [wordSpacing, setWordSpacing] = useState(0);

  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
  } = useChatLogic();

  const handleWordSpacingChange = (newSpacing) => setWordSpacing(newSpacing);

  return (
    <Container maxWidth="xl" disableGutters>
      <Box className="chat-container">
        <Box className="header">
          <Box className="logo" sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Compass Icon" style={{ width: '63px', height: '60px', marginRight: '6px' }} />
            <span>HCII<span className="compass-effect" style={{ color: '#a12614' }}>Compass</span></span>
          </Box>
          <SettingsGear 
            wordSpacing={wordSpacing}
            onWordSpacingChange={handleWordSpacingChange}
          />
        </Box>
        <ChatInterface
          messages={messages}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          sendMessage={sendMessage}
          wordSpacing={wordSpacing}
        />
        <Box className="footer" sx={{ p: 2, borderTop: 1, borderColor: 'grey.300', backgroundColor: 'white' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            This system is AI-powered and may occasionally produce incorrect, biased, or incomplete results. Please use the information with discretion.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
