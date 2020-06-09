import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { getIsSignedIn } from '../store/selectors';

/**
 * If user already logged in, redirect to default protected path.
 *
 */
class AnonymousRoute extends React.Component {
  render() {
    const { children, isSignedIn, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={() => (isSignedIn ? <Redirect to="/" /> : children)}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: getIsSignedIn(state),
  };
};

export default connect(mapStateToProps, {})(AnonymousRoute);
