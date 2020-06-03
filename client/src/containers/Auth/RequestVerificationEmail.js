import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { requestVerificationEmail, unloadAuthPage } from '../../store/actions';
import requireAnonymous from '../../hoc/requireAnonymous';
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
  requireAnonymous(),
  connect(null, { requestVerificationEmail, unloadAuthPage })
)(RequestVerificationEmail);
