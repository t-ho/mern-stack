import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentUser, getIsSignedIn } from '../../store/selectors';

/**
 * If requiresRole is set, the current user must have the same role or higher to continue.
 * If the current user is admin or root, he/she is authorized by default.
 * If the current user is normal user, then check his/her permssions.
 * After checking, if he/she is authorized, render the children component. Otherwise, render nothing.
 *
 */
class ProtectedComponent extends React.Component {
  isAuthorized = () => {
    const {
      currentUser,
      isSignedIn,
      requiresRole,
      permissions,
      requiresAnyPermissions,
    } = this.props;
    if (!isSignedIn) {
      return false;
    }

    if (requiresRole === 'root' && currentUser.role !== 'root') {
      return false;
    }

    if (
      requiresRole === 'admin' &&
      currentUser.role !== 'root' &&
      currentUser.role !== 'admin'
    ) {
      return false;
    }

    if (!permissions) {
      return true;
    }

    if (currentUser.role === 'root' || currentUser.role === 'admin') {
      return true;
    }

    const perms = Array.isArray(permissions) ? permissions : [permissions];

    if (requiresAnyPermissions) {
      return perms.some((perm) => !!currentUser.permissions[perm]);
    }

    return perms.every((perm) => !!currentUser.permissions[perm]);
  };

  render() {
    return this.isAuthorized() ? this.props.children : null;
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: getCurrentUser(state),
    isSignedIn: getIsSignedIn(state),
  };
};

ProtectedComponent.propTypes = {
  requiresRole: PropTypes.string,
  permissions: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  // if requiresAnyPermissions == true, at least one permission must pass to continue.
  // Otherwise, ALL permissions must be pass to continue.
  requiresAnyPermissions: PropTypes.bool,
};

export default connect(mapStateToProps, {})(ProtectedComponent);
