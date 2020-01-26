import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-navigation";
import NavLink from "../components/NavLink";

class SignUpScreen extends React.Component {
  render() {
    return (
      <SafeAreaView forceInset={{ top: "always" }}>
        <Text>SignUpScreen</Text>
        <NavLink text="Have an account? Sign In!" routeName="SignIn" />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});

export default SignUpScreen;
