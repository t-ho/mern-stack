import React from 'react';
import { connect } from 'react-redux';
import {
  getCurrentUser,
  getIsSignedIn,
  getDefaultPath
} from '../store/selectors';
import { setBeforeSignInPath } from '../store/actions';

/**
 * If role == "user", then user, admin and root are authorized
 * If role == "admin", then admin and root are authorized
 * If role == "root", then only root are authorized
 *
 * @param {Component} WrappedComponent The component to be wrapped
 * @param {string} role The role. It could be ['user', 'admin', 'root']
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
        this.props.setBeforeSignInPath(this.props.currentPath);
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
        this.props.history.replace(this.props.defaultPath);
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
      defaultPath: getDefaultPath(state),
      currentPath: state.router.location.pathname
    };
  };

  return connect(mapStateToProps, { setBeforeSignInPath })(ComposedComponent);
};

export default requireRole;
