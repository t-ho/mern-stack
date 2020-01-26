import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-navigation";
import NavLink from "../components/NavLink";

class SignInScreen extends React.Component {
  render() {
    return (
      <SafeAreaView forceInset={{ top: "always" }}>
        <Text>SignInScreen</Text>
        <NavLink text="Don't have an account? Sign Up!" routeName="SignUp" />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});

export default SignInScreen;
