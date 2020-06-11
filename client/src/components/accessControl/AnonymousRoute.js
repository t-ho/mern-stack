import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { getIsSignedIn } from '../../store/selectors';

/**
 * If user already logged in, redirect to default protected path.
 *
 */
class AnonymousRoute extends React.Component {
  render() {
    const { component: Component, isSignedIn, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(props) =>
          isSignedIn ? <Redirect to="/" /> : <Component {...props} />
        }
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
