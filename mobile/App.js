import React from 'react';
import { Provider } from 'react-redux';
import { enableScreens } from 'react-native-screens';
import AppNavigator from './src/navigation/AppNavigator';
import configureStore from './src/store/configureStore';
import NavService from './src/navigation/NavigationService';

enableScreens();

const store = configureStore();

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator
          ref={navigatorRef => NavService.setTopLevelNavigator(navigatorRef)}
        />
      </Provider>
    );
  }
}

export default App;
