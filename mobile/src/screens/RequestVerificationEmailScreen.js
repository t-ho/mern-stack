import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { NavigationEvents, SafeAreaView } from 'react-navigation';
import StatusBar from '../components/StatusBar';
import RequestTokenForm from '../components/RequestTokenForm';
import { requestVerificationEmail, unloadAuthScreen } from '../store/actions';

class RequestVerificationEmailScreen extends React.Component {
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
          tokenPurpose="verify-email"
          title="Resend Verification Email"
          onSubmit={this.props.requestVerificationEmail}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default connect(null, { requestVerificationEmail, unloadAuthScreen })(
  RequestVerificationEmailScreen
);
