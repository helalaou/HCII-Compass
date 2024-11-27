import { IconButton, Typography, Box, Slider, Popover, List, ListItem, ListItemText, Select, MenuItem, Divider } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSettingsLogic } from '../hooks/useSettingsLogic';

const fonts = ['Arial', 'Tahoma', 'Calibri', 'Verdana', 'Times New Roman', 'OpenDyslexic'];

function SettingsGear({ 
  fontSize, onFontSizeChange, 
  fontFamily, onFontFamilyChange, 
  letterSpacing, onLetterSpacingChange, 
  wordSpacing, onWordSpacingChange, 
  oneSentencePerLine, onOneSentencePerLineChange 
}) {
  const initialSettings = {
    fontSize, fontFamily, letterSpacing, wordSpacing, oneSentencePerLine
  };

  const {
    anchorEl,
    currentView,
    settings,
    handleClick,
    handleClose,
    handleViewChange,
    handleSettingChange
  } = useSettingsLogic(initialSettings);

  const fontStyle = {
    fontFamily: settings.fontFamily === 'OpenDyslexic' ? 'OpenDyslexic, sans-serif' : settings.fontFamily,
    fontSize: `${settings.fontSize}px`,
    letterSpacing: `${settings.letterSpacing}px`,
    wordSpacing: `${settings.wordSpacing}px`,
  };

  const renderMainView = () => (
    <List>
      <ListItem button onClick={() => handleViewChange('fontSettings')} sx={{ cursor: 'pointer' }}>
        <ListItemText primary="Font Settings" primaryTypographyProps={{ style: fontStyle }} />
      </ListItem>
      <Divider />
      <ListItem button onClick={() => handleViewChange('textSpacing')} sx={{ cursor: 'pointer' }}>
        <ListItemText primary="Text Spacing" primaryTypographyProps={{ style: fontStyle }} />
      </ListItem>
    </List>
  );

  const renderFontSettings = () => (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => handleViewChange('main')} size="small" sx={{ mr: 1, cursor: 'pointer' }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" style={fontStyle}>Font Settings</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography gutterBottom style={fontStyle}>Font Size</Typography>
      <Slider
        value={settings.fontSize}
        onChange={(_, newValue) => {
          handleSettingChange('fontSize', newValue);
          onFontSizeChange(newValue);
        }}
        aria-labelledby="font-size-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={12}
        max={24}
        sx={{ mb: 2 }}
      />
      <Divider sx={{ my: 2 }} />
      <Typography gutterBottom style={fontStyle}>Font Family</Typography>
      <Select
        value={settings.fontFamily}
        onChange={(e) => {
          handleSettingChange('fontFamily', e.target.value);
          onFontFamilyChange(e.target.value);
        }}
        fullWidth
        sx={{ mb: 2, ...fontStyle }}
      >
        {fonts.map((font) => (
          <MenuItem key={font} value={font} style={{ fontFamily: font === 'OpenDyslexic' ? 'OpenDyslexic, sans-serif' : font }}>
            {font}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );

  const renderTextSpacing = () => (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => handleViewChange('main')} size="small" sx={{ mr: 1, cursor: 'pointer' }}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" style={fontStyle}>Text Spacing</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography gutterBottom style={fontStyle}>Letter Spacing</Typography>
      <Slider
        value={settings.letterSpacing}
        onChange={(_, newValue) => {
          handleSettingChange('letterSpacing', newValue);
          onLetterSpacingChange(newValue);
        }}
        aria-labelledby="letter-spacing-slider"
        valueLabelDisplay="auto"
        step={0.1}
        marks={[
          { value: 0, label: '0' },
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
          { value: 4, label: '4' },
          { value: 5, label: '5' },
        ]}
        min={0}
        max={5}
        sx={{ mb: 2 }}
      />
      <Divider sx={{ my: 2 }} />
      <Typography gutterBottom style={fontStyle}>Word Spacing</Typography>
      <Slider
        value={settings.wordSpacing}
        onChange={(_, newValue) => {
          handleSettingChange('wordSpacing', newValue);
          onWordSpacingChange(newValue);
        }}
        aria-labelledby="word-spacing-slider"
        valueLabelDisplay="auto"
        step={0.2}
        marks={[
          { value: 0, label: '0' },
          { value: 2, label: '1' },
          { value: 4, label: '2' },
          { value: 6, label: '3' },
          { value: 8, label: '4' },
          { value: 10, label: '5' },
        ]}
        min={0}
        max={10}
        sx={{ mb: 2 }}
      />
    </Box>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'fontSettings':
        return renderFontSettings();
      case 'textSpacing':
        return renderTextSpacing();
      default:
        return renderMainView();
    }
  };

  return (
    <>
      <IconButton aria-label="settings" onClick={handleClick} sx={{ cursor: 'pointer' }}>
        <SettingsIcon />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ 
          p: 3, 
          width: 300, 
          border: '1px solid #e0e0e0', 
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f5f5f5',
          ...fontStyle,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2" style={{...fontStyle, fontWeight: 'bold'}}>Settings</Typography>
            <IconButton onClick={handleClose} size="small" sx={{ cursor: 'pointer' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {renderContent()}
        </Box>
      </Popover>
    </>
  );
}

export default SettingsGear;
