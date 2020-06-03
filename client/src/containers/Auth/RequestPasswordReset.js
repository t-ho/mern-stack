import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { requestPasswordReset, unloadAuthPage } from '../../store/actions';
import requireAnonymous from '../../hoc/requireAnonymous';
import RequestTokenForm from '../../components/RequestTokenForm';

class RequestPasswordReset extends React.Component {
  render() {
    return (
      <RequestTokenForm
        tokenPurpose="reset-password"
        title="Send Password Reset Email"
        onSubmit={this.props.requestPasswordReset}
      />
    );
  }

  componentWillUnmount() {
    this.props.unloadAuthPage();
  }
}

export default compose(
  requireAnonymous(),
  connect(null, { requestPasswordReset, unloadAuthPage })
)(RequestPasswordReset);
