import React from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { NavigationEvents, SafeAreaView } from 'react-navigation';
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
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        <RequestTokenForm
          tokenPurpose="verifyEmail"
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
