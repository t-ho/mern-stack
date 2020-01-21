import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { requestPasswordReset } from '../../store/actions';
import requireAnonymous from '../../hoc/requireAnonymous';
import RequestTokenForm from '../../components/RequestTokenForm';

class RequestPasswordReset extends React.Component {
  render() {
    return (
      <RequestTokenForm
        tokenPurpose="resetPassword"
        title="Send Password Reset Email"
        onSubmit={this.props.requestPasswordReset}
      />
    );
  }
}

export default compose(
  requireAnonymous(),
  connect(null, { requestPasswordReset })
)(RequestPasswordReset);
