import { createAppContainer, createSwitchNavigator } from "react-navigation";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";

const switchNavigator = createSwitchNavigator({
  SignIn: SignInScreen,
  SignUp: SignUpScreen
});

const AppNavigator = createAppContainer(switchNavigator);

export default AppNavigator;
