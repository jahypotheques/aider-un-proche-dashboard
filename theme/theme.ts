'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9AAEA1',
    },
    secondary: {
      main: '#7FA88E',
    },
    background: {
      default: '#1a1f1c',
      paper: '#242a26',
    },
    text: {
      primary: '#F6F7F7',
      secondary: '#9AAEA1',
    },
    divider: 'rgba(154, 174, 161, 0.12)',
  },
  typography: {
    fontFamily: 'var(--font-geist-sans)',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#161D19',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#242a26',
          backgroundImage: 'none',
          border: '1px solid rgba(154, 174, 161, 0.12)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#242a26',
          backgroundImage: 'none',
          border: '1px solid rgba(154, 174, 161, 0.12)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(154, 174, 161, 0.12)',
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#1f2522',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(154, 174, 161, 0.05)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
