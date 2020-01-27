import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, Text } from 'react-native';

class MainScreen extends React.Component {
  render() {
    return (
      <SafeAreaView forceInset={{ top: 'always' }}>
        <Text>MainScreen</Text>
        <Text>You are logged in</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});

export default MainScreen;
