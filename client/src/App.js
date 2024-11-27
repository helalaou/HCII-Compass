import React, { useState } from 'react';
import './App.css';
import { Container, Box } from '@mui/material';
import SettingsGear from './components/SettingsGear';
import ChatInterface from './components/ChatInterface';
import { useChatLogic } from './hooks/useChatLogic';
import logo from './logo.png';

function App() {
  const [fontSize, setFontSize] = useState(18);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [oneSentencePerLine, setOneSentencePerLine] = useState(false);

  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
  } = useChatLogic();

  const handleFontSizeChange = (newSize) => setFontSize(newSize);
  const handleFontFamilyChange = (newFont) => setFontFamily(newFont);
  const handleLetterSpacingChange = (newSpacing) => setLetterSpacing(newSpacing);
  const handleWordSpacingChange = (newSpacing) => setWordSpacing(newSpacing);
  const handleOneSentencePerLineChange = (newValue) => setOneSentencePerLine(newValue);

  return (
    <Container maxWidth="xl" disableGutters>
      <Box className="chat-container">
        <Box className="header">
          <Box className="logo" sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Compass Icon" style={{ width: '63px', height: '60px', marginRight: '6px' }} />
            <span>HCII<span className="compass-effect" style={{ color: '#a12614' }}>Compass</span></span>
          </Box>
          <SettingsGear 
            fontSize={fontSize} 
            onFontSizeChange={handleFontSizeChange}
            fontFamily={fontFamily}
            onFontFamilyChange={handleFontFamilyChange}
            letterSpacing={letterSpacing}
            onLetterSpacingChange={handleLetterSpacingChange}
            wordSpacing={wordSpacing}
            onWordSpacingChange={handleWordSpacingChange}
            oneSentencePerLine={oneSentencePerLine}
            onOneSentencePerLineChange={handleOneSentencePerLineChange}
          />
        </Box>
        <ChatInterface
          messages={messages}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          sendMessage={sendMessage}
          fontSize={fontSize}
          fontFamily={fontFamily}
          letterSpacing={letterSpacing}
          wordSpacing={wordSpacing}
          oneSentencePerLine={oneSentencePerLine}
        />
      </Box>
    </Container>
  );
}

export default App;
