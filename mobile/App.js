import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import {
  Colors,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { enableScreens } from 'react-native-screens';
import AppNavigator from './src/navigation/AppNavigator';
import configureStore from './src/store/configureStore';
import NavService from './src/navigation/NavigationService';

enableScreens();

const store = configureStore();
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1d91b4',
    accent: Colors.pink500,
  },
};

class App extends React.Component {
  render() {
    return (
      <StoreProvider store={store}>
        <PaperProvider theme={theme}>
          <AppNavigator
            ref={(navigatorRef) =>
              NavService.setTopLevelNavigator(navigatorRef)
            }
          />
        </PaperProvider>
      </StoreProvider>
    );
  }
}

export default App;
