import React from 'react';
import { connect } from 'react-redux';
import RequestTokenForm from '../components/RequestTokenForm';
import { requestPasswordReset, unloadAuthScreen } from '../store/actions';

class RequestPasswordResetScreen extends React.Component {
  render() {
    return (
      <RequestTokenForm
        tokenPurpose="resetPassword"
        title="Send Password Reset Email"
        onSubmit={this.props.requestPasswordReset}
      />
    );
  }

  componentWillUnmount() {
    this.props.unloadAuthScreen();
  }
}

export default connect(null, { requestPasswordReset, unloadAuthScreen })(
  RequestPasswordResetScreen
);
