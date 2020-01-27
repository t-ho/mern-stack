import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import MainScreen from '../screens/MainScreen';
import RequestPasswordResetScreen from '../screens/RequestPasswordResetScreen';
import RequestVerificationEmailScreen from '../screens/RequestVerificationEmailScreen';

const switchNavigator = createSwitchNavigator({
  SignIn: SignInScreen,
  SignUp: SignUpScreen,
  RequestPasswordReset: RequestPasswordResetScreen,
  RequestVerificationEmail: RequestVerificationEmailScreen,
  Main: MainScreen
});

const AppNavigator = createAppContainer(switchNavigator);

export default AppNavigator;
