import React from 'react';
import { Box, Typography } from '@mui/material';
import { useMessageLogic } from '../hooks/useMessageLogic';
import { useSettingsLogic } from '../hooks/useSettingsLogic';

function Message({ text, sender, fontSize, fontFamily, letterSpacing, wordSpacing, oneSentencePerLine, sentenceSpacing }) {
  const initialSettings = {
    fontSize, fontFamily, letterSpacing, wordSpacing, oneSentencePerLine,
    sentenceSpacing
  };

  const { handleSimplify } = useSettingsLogic(initialSettings);

  const {
    sentences,
  } = useMessageLogic(text, handleSimplify, null);

  const fontStyle = {
    fontFamily: fontFamily === 'OpenDyslexic' ? 'OpenDyslexic, sans-serif' : fontFamily,
    fontSize: `${fontSize}px`,
    letterSpacing: `${letterSpacing}px`,
    wordSpacing: `${wordSpacing}px`,
  };

  return (
    <Box
      className={`message ${sender}`}
      sx={{
        whiteSpace: 'pre-wrap',
        marginBottom: 1,
        padding: 1,
        borderRadius: 2,
        maxWidth: '80%',
        alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
        backgroundColor: sender === 'user' ? 'primary.main' : 'grey.300',
        color: sender === 'user' ? 'white' : 'black',
        marginLeft: sender === 'user' ? 'auto' : '0',
        position: 'relative',
        ...fontStyle,
      }}
    >
      <Typography
        variant="body1"
        component="div"
        sx={fontStyle}
      >
        {sentences.map((sentence, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: oneSentencePerLine ? 'block' : 'inline', 
              marginBottom: oneSentencePerLine ? `${sentenceSpacing * 0.5}em` : 0,
              position: 'relative',
              transition: 'background-color 0.3s',
            }}
          >
            {sentence}
            {!oneSentencePerLine && ' '}
          </Box>
        ))}
      </Typography>
    </Box>
  );
}

export default Message;
