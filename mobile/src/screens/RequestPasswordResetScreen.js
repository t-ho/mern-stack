import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { NavigationEvents, SafeAreaView } from 'react-navigation';
import StatusBar from '../components/StatusBar';
import RequestTokenForm from '../components/RequestTokenForm';
import { requestPasswordReset, unloadAuthScreen } from '../store/actions';

class RequestPasswordResetScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
    title: '',
  };

  render() {
    return (
      <SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
        <NavigationEvents onWillBlur={this.props.unloadAuthScreen} />
        <StatusBar barStyle="dark-content" />
        <RequestTokenForm
          tokenPurpose="reset-password"
          title="Send Password Reset Email"
          onSubmit={this.props.requestPasswordReset}
        />
      </SafeAreaView>
    );
  }

  componentWillUnmount() {
    this.props.unloadAuthScreen();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default connect(null, { requestPasswordReset, unloadAuthScreen })(
  RequestPasswordResetScreen
);
