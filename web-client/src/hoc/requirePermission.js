import React from 'react';
import { connect } from 'react-redux';
import {
  getCurrentUser,
  getIsSignedIn,
  getDefaultRedirectUrl
} from '../store/selectors';

/**
 * If the current user is admin or root, he/she is authorized by default.
 * If the current user is normal user, then check his/her permssions
 *
 * @param {Component} WrappedComponent The component to be wrapped
 * @param {string} action The action (see state.auth.permissions)
 */
const requirePermission = (WrappedComponent, action) => {
  class ComposedComponent extends React.Component {
    componentDidMount() {
      this.shouldNavigateAway();
    }

    componentDidUpdate() {
      this.shouldNavigateAway();
    }

    isAuthorized = () => {
      const { currentUser, isSignedIn } = this.props;
      if (!isSignedIn) {
        return false;
      }

      if (currentUser.role === 'root' || currentUser.role === 'admin') {
        return true;
      }

      if (currentUser.pemissions[action]) {
        return true;
      }

      return false;
    };

    shouldNavigateAway = () => {
      if (!this.isAuthorized()) {
        this.props.history.replace(this.props.redirectUrl);
      }
    };

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  const mapStateToProps = state => {
    return {
      currentUser: getCurrentUser(state),
      isSignedIn: getIsSignedIn(state),
      redirectUrl: getDefaultRedirectUrl(state)
    };
  };

  return connect(mapStateToProps)(ComposedComponent);
};

export default requirePermission;
