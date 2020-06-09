import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { requestVerificationEmail, unloadAuthPage } from '../../store/actions';
import RequestTokenForm from '../../components/RequestTokenForm';

class RequestVerificationEmail extends React.Component {
  render() {
    return (
      <RequestTokenForm
        tokenPurpose="verify-email"
        title="Resend Verification Email"
        onSubmit={this.props.requestVerificationEmail}
      />
    );
  }

  componentWillUnmount() {
    this.props.unloadAuthPage();
  }
}

export default compose(
  connect(null, { requestVerificationEmail, unloadAuthPage })
)(RequestVerificationEmail);
