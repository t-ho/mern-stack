import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { signOut } from '../store/actions';

class MainScreen extends React.Component {
  render() {
    return (
      <SafeAreaView forceInset={{ top: 'always' }}>
        <Text>MainScreen</Text>
        <Button title="Sign Out" onPress={this.props.signOut} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});

export default connect(null, { signOut })(MainScreen);
