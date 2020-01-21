import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { requestVerificationEmail } from '../../store/actions';
import requireAnonymous from '../../hoc/requireAnonymous';
import RequestTokenForm from '../../components/RequestTokenForm';

class RequestVerificationEmail extends React.Component {
  render() {
    return (
      <RequestTokenForm
        tokenPurpose="verifyEmail"
        title="Resend Verification Email"
        onSubmit={this.props.requestVerificationEmail}
      />
    );
  }
}

export default compose(
  requireAnonymous(),
  connect(null, { requestVerificationEmail })
)(RequestVerificationEmail);
