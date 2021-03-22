import { replace } from 'connected-react-router';
import * as actionTypes from './types';

export const signUp = (formValues) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.SIGN_UP });
  return mernApi.post('/api/auth/signup', formValues).then(
    (response) => {
      dispatch({ type: actionTypes.SIGN_UP_SUCCESS });
    },
    (err) => {
      dispatch({
        type: actionTypes.SIGN_UP_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};

export const signIn = (formValues) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.SIGN_IN });
  return signInHelper(
    '/api/auth/signin',
    formValues,
    actionTypes.SIGN_IN_SUCCESS,
    actionTypes.SIGN_IN_FAIL,
    dispatch,
    mernApi
  );
};

export const facebookSignIn = (formValues) => (
  dispatch,
  getState,
  { mernApi }
) => {
  dispatch({ type: actionTypes.FACEBOOK_SIGN_IN });
  return signInHelper(
    '/api/auth/facebook',
    formValues,
    actionTypes.FACEBOOK_SIGN_IN_SUCCESS,
    actionTypes.FACEBOOK_SIGN_IN_FAIL,
    dispatch,
    mernApi
  );
};

export const googleSignIn = (formValues) => (
  dispatch,
  getState,
  { mernApi }
) => {
  dispatch({ type: actionTypes.GOOGLE_SIGN_IN });
  return signInHelper(
    '/api/auth/google',
    formValues,
    actionTypes.GOOGLE_SIGN_IN_SUCCESS,
    actionTypes.GOOGLE_SIGN_IN_FAIL,
    dispatch,
    mernApi
  );
};

export const tryLocalSignIn = () => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.TRY_LOCAL_SIGN_IN });
  try {
    const authInfo = JSON.parse(localStorage.getItem('authInfo'));
    const now = Math.floor(Date.now() / 1000);
    if (!authInfo || (authInfo && authInfo.expiresAt <= now)) {
      return Promise.resolve().then(() => {
        dispatch(tryLocalSignInFail());
      });
    }
    mernApi.setAuthToken(authInfo.token);
    return mernApi
      .post('/api/auth/verify-jwt-token', {
        refreshToken: true,
        refreshUser: true,
      })
      .then(
        (response) => {
          authInfo.token = response.data.token;
          authInfo.expiresAt = response.data.expiresAt;
          authInfo.user = response.data.user;
          dispatch(
            signInSuccess(authInfo, actionTypes.TRY_LOCAL_SIGN_IN_SUCCESS)
          );
        },
        (err) => {
          dispatch(tryLocalSignInFail());
        }
      );
  } catch (err) {
    dispatch(tryLocalSignInFail(err));
  }
};

const signInSuccess = (payload, successType) => (
  dispatch,
  getState,
  { mernApi }
) => {
  setAuthInfo(payload, mernApi);
  dispatch({ type: successType, payload });
  if (getState().auth.attemptedPath) {
    dispatch(replace(getState().auth.attemptedPath));
    dispatch(setAttemptedPath(null));
  }
};

const tryLocalSignInFail = () => (dispatch, getState, { mernApi }) => {
  clearAuthInfo(mernApi);
  dispatch({ type: actionTypes.TRY_LOCAL_SIGN_IN_FAIL });
};

export const setAttemptedPath = (path) => {
  return {
    type: actionTypes.SET_ATTEMPTED_PATH,
    payload: path,
  };
};

export const signOut = () => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.SIGN_OUT });
  clearAuthInfo(mernApi);
  dispatch({ type: actionTypes.SIGN_OUT_SUCCESS });
};

export const verifyEmail = (formValues, token) => (
  dispatch,
  getState,
  { mernApi }
) => {
  dispatch({ type: actionTypes.VERIFY_EMAIL });
  return mernApi.post(`/api/auth/verify-email/${token}`, formValues).then(
    (response) => {
      dispatch({ type: actionTypes.VERIFY_EMAIL_SUCCESS });
    },
    (err) => {
      dispatch({
        type: actionTypes.VERIFY_EMAIL_FAIL,
        payload: err.response.data.error.message,
      });
    }
  );
};

export const requestVerificationEmail = (formValues) => {
  return (dispatch, getState, { mernApi }) => {
    dispatch({ type: actionTypes.REQUEST_VERIFICATION_EMAIL });
    return mernApi.post('/api/auth/send-token', formValues).then(
      (response) => {
        dispatch({ type: actionTypes.REQUEST_VERIFICATION_EMAIL_SUCCESS });
      },
      (err) => {
        dispatch({
          type: actionTypes.REQUEST_VERIFICATION_EMAIL_FAIL,
          payload: err.response.data.error.message,
        });
      }
    );
  };
};

export const requestPasswordReset = (formValues) => {
  return (dispatch, getState, { mernApi }) => {
    dispatch({ type: actionTypes.REQUEST_PASSWORD_RESET });
    return mernApi.post('/api/auth/send-token', formValues).then(
      (response) => {
        dispatch({ type: actionTypes.REQUEST_PASSWORD_RESET_SUCCESS });
      },
      (err) => {
        dispatch({
          type: actionTypes.REQUEST_PASSWORD_RESET_FAIL,
          payload: err.response.data.error.message,
        });
      }
    );
  };
};

export const resetPassword = (formValues, token) => {
  return (dispatch, getState, { mernApi }) => {
    dispatch({ type: actionTypes.RESET_PASSWORD });
    return mernApi.post(`/api/auth/reset-password/${token}`, formValues).then(
      (response) => {
        dispatch({ type: actionTypes.RESET_PASSWORD_SUCCESS });
      },
      (err) =>
        dispatch({
          type: actionTypes.RESET_PASSWORD_FAIL,
          payload: err.response.data.error.message,
        })
    );
  };
};

export const unloadAuthPage = () => {
  return {
    type: actionTypes.UNLOAD_AUTH_PAGE,
  };
};

const signInHelper = (
  endpoint,
  payload,
  successType,
  failType,
  dispatch,
  mernApi
) => {
  return mernApi.post(endpoint, payload).then(
    (response) => {
      dispatch(signInSuccess(response.data, successType));
    },
    (err) => {
      dispatch({ type: failType, payload: err.response.data.error.message });
    }
  );
};

const setAuthInfo = (authInfo, mernApi) => {
  mernApi.setAuthToken(authInfo.token);
  localStorage.setItem('authInfo', JSON.stringify(authInfo));
};

const clearAuthInfo = (mernApi) => {
  mernApi.setAuthToken('');
  localStorage.removeItem('authInfo');
};
