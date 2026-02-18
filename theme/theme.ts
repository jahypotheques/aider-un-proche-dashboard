'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9AAEA1', // Border color - used for accents
    },
    secondary: {
      main: '#9AAEA1',
    },
    background: {
      default: '#323D37', // Content background
      paper: '#323D37',
    },
    text: {
      primary: '#F6F7F7',
      secondary: '#9AAEA1',
    },
    divider: '#9AAEA1',
  },
  typography: {
    fontFamily: 'var(--font-geist-sans)',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#161D19', // Header background
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#323D37',
          borderColor: '#9AAEA1',
          borderWidth: '1px',
          borderStyle: 'solid',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#323D37',
          borderColor: '#9AAEA1',
          borderWidth: '1px',
          borderStyle: 'solid',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#9AAEA1',
        },
      },
    },
  },
});

export default theme;
