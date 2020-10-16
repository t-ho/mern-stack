import { createSelector } from 'reselect';
import routeCategories from '../../routes';

export const getAuthState = (state) => state.auth;

export const getProcessing = createSelector(
  getAuthState,
  (auth) => auth.processing
);

export const getProcessed = createSelector(
  getAuthState,
  (auth) => auth.processed
);

export const getSignedInWith = createSelector(
  getAuthState,
  (auth) => auth.signedInWith
);

export const getError = createSelector(getAuthState, (auth) => {
  return auth.error;
});

export const getCurrentUser = createSelector(getAuthState, (auth) => auth.user);

export const getIsSignedIn = createSelector(
  getAuthState,
  (auth) => auth.isSignedIn
);

const isAuthorized = (user, route) => {
  if (!user.id) {
    return false;
  }

  if (route.requiresRole === 'root' && user.role !== 'root') {
    return false;
  }

  if (
    route.requiresRole === 'admin' &&
    user.role !== 'root' &&
    user.role !== 'admin'
  ) {
    return false;
  }

  if (!route.permissions) {
    return true;
  }

  if (user.role === 'root' || user.role === 'admin') {
    return true;
  }

  const perms = Array.isArray(route.permissions)
    ? route.permissions
    : [route.permissions];

  if (route.requiresAnyPermissions) {
    return perms.some((perm) => !!user.permissions[perm]);
  }

  return perms.every((perm) => !!user.permissions[perm]);
};

export const getRouteCategories = createSelector(getCurrentUser, (user) => {
  let result = [];
  routeCategories.forEach((category) => {
    let routes = [];
    let isHidden = true;
    category.routes.forEach((route) => {
      if (isAuthorized(user, route)) {
        routes.push(route);
        if (!category.isHidden && !route.isHidden) {
          isHidden = false;
        }
      }
    });
    if (routes.length > 0) {
      result.push({ ...category, isHidden, routes });
    }
  });
  return result;
});
