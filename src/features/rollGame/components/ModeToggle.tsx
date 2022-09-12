import React from 'react';
import { IconButton, Tooltip, useColorScheme } from '@mui/material';
import DarkThemeIcon from '@mui/icons-material//Brightness7';
import LightThemeIcon from '@mui/icons-material//Brightness4';
import useMounted from 'hooks/useMounted';
import analytics from 'utils/analytics';

const ModeToggle = () => {
  const { mode, setMode } = useColorScheme();
  const mounted = useMounted();

  const handleToggleTheme = () => {
    const newValue = mode === 'dark' ? 'light' : 'dark';

    analytics.ui.changeColorScheme(newValue);
    setMode(newValue);
  };

  if (!mounted) {
    return (
      <Tooltip title="Toggle dark/light theme">
        <IconButton color="inherit">
          <DarkThemeIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Tooltip title="Toggle dark/light theme">
      <IconButton color="inherit" onClick={handleToggleTheme}>
        {mode === 'dark' ? <LightThemeIcon /> : <DarkThemeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ModeToggle;
