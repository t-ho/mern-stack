import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainScreen from '../screens/MainScreen';

const switchNavigator = createSwitchNavigator({
  SignIn: SignInScreen,
  SignUp: SignUpScreen,
  Main: MainScreen
});

const AppNavigator = createAppContainer(switchNavigator);

export default AppNavigator;
