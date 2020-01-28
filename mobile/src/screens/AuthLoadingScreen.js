import React from 'react';
import { connect } from 'react-redux';
import { tryLocalSignIn } from '../store/actions';

class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this.props.tryLocalSignIn();
  }

  render() {
    return null;
  }
}

export default connect(null, { tryLocalSignIn })(AuthLoadingScreen);
