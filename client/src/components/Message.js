import React from 'react';
import { Box, Typography } from '@mui/material';
import { useMessageLogic } from '../hooks/useMessageLogic';
import ReactMarkdown from 'react-markdown';

function Message({ text, sender, fontSize, fontFamily, letterSpacing, wordSpacing, oneSentencePerLine, sentenceSpacing }) {
  const {
    sentences,
  } = useMessageLogic(text, null);

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
      {sender === 'llm' ? (
        <ReactMarkdown 
          components={{
            p: ({ node, ...props }) => <Typography {...props} sx={{ margin: 0 }} />,
            li: ({ node, ...props }) => <Typography component="li" {...props} sx={{ margin: '0.05em 0' }} />,
            ul: ({ node, ...props }) => <Typography component="ul" {...props} sx={{ margin: '0.05em 0', padding: '0 1em' }} />,
            ol: ({ node, ...props }) => <Typography component="ol" {...props} sx={{ margin: '0.05em 0', padding: '0 1em' }} />,
            blockquote: ({ node, ...props }) => <Typography component="blockquote" {...props} sx={{ margin: '0.1em 0' }} />,
            h1: ({ node, ...props }) => <Typography variant="h5" {...props} sx={{ margin: '0.05em 0' }} />,
            h2: ({ node, ...props }) => <Typography variant="h6" {...props} sx={{ margin: '0.05em 0' }} />,
            h3: ({ node, ...props }) => <Typography variant="subtitle1" {...props} sx={{ margin: '0.05em 0' }} />,
            h4: ({ node, ...props }) => <Typography variant="subtitle2" {...props} sx={{ margin: '0.05em 0' }} />,
          }}
        >
          {text}
        </ReactMarkdown>
      ) : (
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
      )}
    </Box>
  );
}

export default Message;
