import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1d91b4',
    },
    secondary: {
      main: '#e91e63',
    },
  },
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: '#18202c',
      },
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
      },
    },
  },
});

export default theme;
