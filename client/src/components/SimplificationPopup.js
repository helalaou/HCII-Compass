import React from 'react';
import { Box, Typography, CircularProgress, Popover, Divider, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

function SimplificationPopup({ 
  anchorEl, 
  simplifications, 
  error, 
  isSimplifying, 
  handleClose, 
  handleSimplificationSelect,
  fontStyle 
}) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box sx={{ p: 2, maxWidth: 300 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ ...fontStyle, fontWeight: 'bold' }}>
            Please select your preferred simplification
          </Typography>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        {isSimplifying ? (
          <CircularProgress size={20} />
        ) : error ? (
          <Typography color="error" sx={fontStyle}>{error}</Typography>
        ) : simplifications.length > 0 ? (
          simplifications.map((simplification, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <Divider sx={{ my: 1, borderBottomWidth: 2 }} />}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ ...fontStyle, flex: 1 }}>{simplification}</Typography>
                <CheckCircleIcon 
                  color="primary"
                  sx={{ cursor: 'pointer', ml: 1 }}
                  onClick={() => handleSimplificationSelect(simplification)}
                />
              </Box>
            </React.Fragment>
          ))
        ) : (
          <Typography sx={fontStyle}>No simplifications available</Typography>
        )}
      </Box>
    </Popover>
  );
}

export default SimplificationPopup;
