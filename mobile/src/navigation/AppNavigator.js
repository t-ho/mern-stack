import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SignInOptionsScreen from '../screens/SignInOptionsScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainScreen from '../screens/MainScreen';
import RequestPasswordResetScreen from '../screens/RequestPasswordResetScreen';
import RequestVerificationEmailScreen from '../screens/RequestVerificationEmailScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

const authStack = createStackNavigator(
  {
    SignInOptions: SignInOptionsScreen,
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
    RequestPasswordReset: RequestPasswordResetScreen,
    RequestVerificationEmail: RequestVerificationEmailScreen
  },
  { initialRouteName: 'SignInOptions' }
);

const mainSwitch = createSwitchNavigator(
  {
    Main: MainScreen
  },
  { initialRouteName: 'Main' }
);

const switchNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    authStack,
    mainSwitch
  },
  {
    initialRouteName: 'AuthLoading'
  }
);

const AppNavigator = createAppContainer(switchNavigator);

export default AppNavigator;
