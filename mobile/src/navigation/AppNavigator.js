import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import RequestPasswordResetScreen from '../screens/RequestPasswordResetScreen';
import RequestVerificationEmailScreen from '../screens/RequestVerificationEmailScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

const authStack = createStackNavigator(
  {
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
    RequestPasswordReset: RequestPasswordResetScreen,
    RequestVerificationEmail: RequestVerificationEmailScreen,
  },
  { initialRouteName: 'SignIn' }
);

const mainBottomTabs = createMaterialBottomTabNavigator(
  {
    Home: { screen: HomeScreen },
    Settings: { screen: SettingsScreen },
  },
  { initialRouteName: 'Home' }
);

const switchNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    authStack,
    mainBottomTabs,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

const AppNavigator = createAppContainer(switchNavigator);

export default AppNavigator;
