import React from 'react';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import RequestTokenForm from '../components/RequestTokenForm';
import { requestPasswordReset, unloadAuthScreen } from '../store/actions';

class RequestPasswordResetScreen extends React.Component {
  static navigationOptions = {
    title: ''
  };

  render() {
    return (
      <>
        <NavigationEvents onWillBlur={this.props.unloadAuthScreen} />
        <RequestTokenForm
          tokenPurpose="resetPassword"
          title="Send Password Reset Email"
          onSubmit={this.props.requestPasswordReset}
        />
      </>
    );
  }

  componentWillUnmount() {
    this.props.unloadAuthScreen();
  }
}

export default connect(null, { requestPasswordReset, unloadAuthScreen })(
  RequestPasswordResetScreen
);
