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

  if (!route.permissions) {
    return true;
  }

  if (user.role === 'root' || user.role === 'admin') {
    return true;
  }

  const perms = Array.isArray(route.permissions)
    ? route.permissions
    : [route.permissions];

  if (route.requiresAny) {
    return perms.some((perm) => !!user.permissions[perm]);
  }

  return perms.every((perm) => !!user.permissions[perm]);
};

export const getRouteCategories = createSelector(getCurrentUser, (user) => {
  let result = [];
  routeCategories.forEach((category) => {
    const routes = [];
    category.routes.forEach((route) => {
      if (isAuthorized(user, route)) {
        routes.push(route);
      }
    });
    if (routes.length > 0) {
      result.push({ ...category, routes });
    }
  });
  return result;
});
