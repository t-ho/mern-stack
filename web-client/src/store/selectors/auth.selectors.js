import { createSelector } from 'reselect';

export const getAuthState = state => state.auth;

export const getProcessing = createSelector(
  getAuthState,
  auth => auth.processing
);

export const getError = createSelector(getAuthState, auth => {
  return auth.error;
});

export const getCurrentUser = createSelector(getAuthState, auth => auth.user);

export const getIsSignedIn = createSelector(
  getCurrentUser,
  currentUser => currentUser.token !== null
);
