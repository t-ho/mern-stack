import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { signOut } from '../store/actions';
import Spacer from '../components/Spacer';

class MainScreen extends React.Component {
  render() {
    return (
      <SafeAreaView forceInset={{ top: 'always' }}>
        <Spacer>
          <Text>MainScreen</Text>
          <Text>You are logged in</Text>
        </Spacer>
        <Spacer>
          <Button title="Sign Out" onPress={this.props.signOut} />
        </Spacer>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});

export default connect(null, { signOut })(MainScreen);
