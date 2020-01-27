import React from 'react';
import { connect } from 'react-redux';
import RequestTokenForm from '../components/RequestTokenForm';
import { requestVerificationEmail, unloadAuthScreen } from '../store/actions';

class RequestVerificationEmailScreen extends React.Component {
  render() {
    return (
      <RequestTokenForm
        tokenPurpose="verifyEmail"
        title="Resend Verification Email"
        onSubmit={this.props.requestVerificationEmail}
      />
    );
  }

  componentWillUnmount() {
    this.props.unloadAuthScreen();
  }
}

export default connect(null, { requestVerificationEmail, unloadAuthScreen })(
  RequestVerificationEmailScreen
);
