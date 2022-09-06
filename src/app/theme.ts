import { createTheme } from '@mui/material';
import { AppTheme } from 'features/rollGame/rollGameTypes';

const getTheme = (mode: AppTheme) =>
  createTheme({
    palette: {
      mode,
    },
  });

export default getTheme;
