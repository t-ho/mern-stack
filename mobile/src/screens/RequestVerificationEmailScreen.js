import React from 'react';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import RequestTokenForm from '../components/RequestTokenForm';
import { requestVerificationEmail, unloadAuthScreen } from '../store/actions';

class RequestVerificationEmailScreen extends React.Component {
  static navigationOptions = {
    title: ''
  };

  render() {
    return (
      <>
        <NavigationEvents onWillBlur={this.props.unloadAuthScreen} />
        <RequestTokenForm
          tokenPurpose="verifyEmail"
          title="Resend Verification Email"
          onSubmit={this.props.requestVerificationEmail}
        />
      </>
    );
  }
}

export default connect(null, { requestVerificationEmail, unloadAuthScreen })(
  RequestVerificationEmailScreen
);
