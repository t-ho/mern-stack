import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentUser, getIsSignedIn } from '../../store/selectors';
import { setAttemptedPath } from '../../store/actions';

/**
 * If the current user is admin or root, he/she is authorized by default.
 * If the current user is normal user, then check his/her permssions.
 * After checking, if he/she is not authorized, redirect to default path.
 *
 */
class ProtectedRoute extends React.Component {
  isAuthorized = () => {
    const {
      currentUser,
      isSignedIn,
      permissions,
      requiresAny,
      location,
      setAttemptedPath,
    } = this.props;
    if (!isSignedIn) {
      setAttemptedPath(location.pathname);
      return false;
    }

    if (!permissions) {
      return true;
    }

    if (currentUser.role === 'root' || currentUser.role === 'admin') {
      return true;
    }

    const perms = Array.isArray(permissions) ? permissions : [permissions];

    if (requiresAny) {
      return perms.some((perm) => !!currentUser.permissions[perm]);
    }

    return perms.every((perm) => !!currentUser.permissions[perm]);
  };

  render() {
    const {
      component: Component,
      currentUser,
      isSignedIn,
      permissions,
      requiresAny,
      ...rest
    } = this.props;
    return (
      <Route
        {...rest}
        render={(props) =>
          this.isAuthorized() ? <Component {...props} /> : <Redirect to="/" />
        }
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: getCurrentUser(state),
    isSignedIn: getIsSignedIn(state),
  };
};

ProtectedRoute.propTypes = {
  component: PropTypes.any.isRequired,
  permissions: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  // if requiresAny == true, at least one permission must pass to continue.
  // Otherwise, ALL permissions must be pass to continue.
  requiresAny: PropTypes.bool,
};

export default connect(mapStateToProps, { setAttemptedPath })(ProtectedRoute);
