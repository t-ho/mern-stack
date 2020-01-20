import React from 'react';
import { connect } from 'react-redux';
import {
  getCurrentUser,
  getIsSignedIn,
  getDefaultRedirectUrl
} from '../store/selectors';

/**
 * If role == "user", then user, admin and root are authorized
 * If role == "admin", then admin and root are authorized
 * If role == "root", then only root are authorized
 */
const requireRole = (WrappedComponent, role) => {
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

      if (role === 'user') {
        // user, admin and root is allowed
        return true;
      } else if (role === 'admin') {
        // admin and root is allowed
        if (currentUser.role === 'admin' || currentUser.role === 'root') {
          return true;
        }
      } else if (role === 'root') {
        // only root is allowed
        if (currentUser.role === 'root') {
          return true;
        }
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

export default requireRole;
