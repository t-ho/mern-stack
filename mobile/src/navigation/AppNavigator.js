import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainScreen from '../screens/MainScreen';
import RequestPasswordResetScreen from '../screens/RequestPasswordResetScreen';
import RequestVerificationEmailScreen from '../screens/RequestVerificationEmailScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

const authStack = createStackNavigator(
  {
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
    RequestPasswordReset: RequestPasswordResetScreen,
    RequestVerificationEmail: RequestVerificationEmailScreen,
  },
  { initialRouteName: 'SignIn' }
);

const mainSwitch = createSwitchNavigator(
  {
    Main: MainScreen,
  },
  { initialRouteName: 'Main' }
);

const switchNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    authStack,
    mainSwitch,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

const AppNavigator = createAppContainer(switchNavigator);

export default AppNavigator;
