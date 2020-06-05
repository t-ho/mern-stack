import React from 'react';
import { connect } from 'react-redux';
import { getCurrentUser, getIsSignedIn } from '../store/selectors';
import { setAttemptedPath } from '../store/actions';

/**
 * If the current user is admin or root, he/she is authorized by default.
 * If the current user is normal user, then check his/her permssions.
 * After checking, if he/she is not authorized, redirect to default path.
 *
 * @param {Component} WrappedComponent The component to be wrapped
 * @param {string|array} actions The actions (see state.auth.permissions)
 * @param {boolean=false} requiresAny If true, at least one action must pass to continue. Otherwise, ALL actions must be pass to continue.
 */
const requirePermissions = (actions, requiresAny = false) => (
  WrappedComponent
) => {
  actions = Array.isArray(actions) ? actions : [actions];
  class ComposedComponent extends React.Component {
    componentDidMount() {
      this.shouldNavigateAway();
    }

    componentDidUpdate() {
      this.shouldNavigateAway();
    }

    isAuthorized = () => {
      const { currentUser, isSignedIn, currentPath } = this.props;
      if (!isSignedIn) {
        this.setAttemptedPath(currentPath);
        return false;
      }

      if (currentUser.role === 'root' || currentUser.role === 'admin') {
        return true;
      }

      if (requiresAny) {
        return actions.some((action) => !!currentUser.pemissions[action]);
      }

      return actions.every((action) => !!currentUser.pemissions[action]);
    };

    shouldNavigateAway = () => {
      if (!this.isAuthorized()) {
        this.props.history.replace('/');
      }
    };

    render() {
      return this.isAuthorized() ? <WrappedComponent {...this.props} /> : null;
    }
  }

  const mapStateToProps = (state) => {
    return {
      currentUser: getCurrentUser(state),
      isSignedIn: getIsSignedIn(state),
      currentPath: state.router.location.pathname,
    };
  };

  return connect(mapStateToProps, { setAttemptedPath })(ComposedComponent);
};

export default requirePermissions;
