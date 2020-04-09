import { replace } from 'connected-react-router';
import * as actionTypes from './types';

export const signUp = (formValues) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.SIGN_UP });
  return mernApi.post('/api/auth/signup', formValues).then(
    (response) => {
      dispatch({ type: actionTypes.SIGN_UP_SUCCESS });
    },
    (err) => {
      dispatch(signUpFail(err.response.data.error));
    }
  );
};

const signUpFail = (payload) => {
  return {
    type: actionTypes.SIGN_UP_FAIL,
    payload,
  };
};

export const signIn = (formValues) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.SIGN_IN });
  return signInHelper(
    '/api/auth/signin',
    formValues,
    signInSuccess,
    signInFail,
    dispatch,
    getState,
    mernApi
  );
};

const signInSuccess = (payload) => {
  return {
    type: actionTypes.SIGN_IN_SUCCESS,
    payload,
  };
};

const signInFail = (payload) => {
  return {
    type: actionTypes.SIGN_IN_FAIL,
    payload,
  };
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
    facebookSignInSuccess,
    facebookSignInFail,
    dispatch,
    getState,
    mernApi
  );
};

const facebookSignInSuccess = (payload) => {
  return {
    type: actionTypes.FACEBOOK_SIGN_IN_SUCCESS,
    payload,
  };
};

const facebookSignInFail = (payload) => {
  return {
    type: actionTypes.FACEBOOK_SIGN_IN_FAIL,
    payload,
  };
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
    googleSignInSuccess,
    googleSignInFail,
    dispatch,
    getState,
    mernApi
  );
};

const googleSignInSuccess = (payload) => {
  return {
    type: actionTypes.GOOGLE_SIGN_IN_SUCCESS,
    payload,
  };
};

const googleSignInFail = (payload) => {
  return {
    type: actionTypes.GOOGLE_SIGN_IN_FAIL,
    payload,
  };
};

export const tryLocalSignIn = () => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.TRY_LOCAL_SIGN_IN });
  try {
    const authInfo = JSON.parse(localStorage.getItem('authInfo'));
    const now = Math.floor(Date.now() / 1000);
    if (!authInfo || (authInfo && authInfo.expiresAt <= now)) {
      dispatch(tryLocalSignInFail());
      return Promise.resolve();
    }
    // if token age > 30 days, then refresh token
    if (authInfo.expiresAt <= now + 30 * 24 * 60 * 60) {
      mernApi.setAuthToken(authInfo.token);
      return mernApi.post('auth/refresh-token').then(
        (response) => {
          authInfo.token = response.data.token;
          authInfo.expiresAt = response.data.expiresAt;
          dispatch(tryLocalSignInSuccess(authInfo));
          redirectAfterSignIn(dispatch, getState);
          setAuthInfo(authInfo, mernApi);
        },
        (err) => {
          dispatch(tryLocalSignInFail());
        }
      );
    } else {
      dispatch(tryLocalSignInSuccess(authInfo));
      redirectAfterSignIn(dispatch, getState);
      return Promise.resolve();
    }
  } catch (err) {
    dispatch(tryLocalSignInFail(err));
  }
};

const tryLocalSignInSuccess = (payload) => (
  dispatch,
  getState,
  { mernApi }
) => {
  setAuthInfo(payload, mernApi);
  dispatch({
    type: actionTypes.TRY_LOCAL_SIGN_IN_SUCCESS,
    payload,
  });
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

export const verifyEmail = (token) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.VERIFY_EMAIL });
  return mernApi.post(`/api/auth/verify-email/${token}`).then(
    (response) => {
      dispatch({ type: actionTypes.VERIFY_EMAIL_SUCCESS });
    },
    (err) => {
      dispatch(verifyEmailFail(err.response.data.error));
    }
  );
};

const verifyEmailFail = (payload) => {
  return {
    type: actionTypes.VERIFY_EMAIL_FAIL,
    payload,
  };
};

export const requestVerificationEmail = (formValues) => {
  return (dispatch, getState, { mernApi }) => {
    dispatch({ type: actionTypes.REQUEST_VERIFICATION_EMAIL });
    return mernApi.post('/api/auth/send-token', formValues).then(
      (response) => {
        dispatch({ type: actionTypes.REQUEST_VERIFICATION_EMAIL_SUCCESS });
      },
      (err) => {
        dispatch(requestVerificationEmailFail(err.response.data.error));
      }
    );
  };
};

const requestVerificationEmailFail = (payload) => {
  return {
    type: actionTypes.REQUEST_VERIFICATION_EMAIL_FAIL,
    payload,
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
        dispatch(requestPasswordResetFail(err.response.data.error));
      }
    );
  };
};

const requestPasswordResetFail = (payload) => {
  return {
    type: actionTypes.REQUEST_PASSWORD_RESET_FAIL,
    payload,
  };
};

export const resetPassword = (formValues, token) => {
  return (dispatch, getState, { mernApi }) => {
    dispatch({ type: actionTypes.RESET_PASSWORD });
    return mernApi.post(`/api/auth/reset-password/${token}`, formValues).then(
      (response) => {
        dispatch({ type: actionTypes.RESET_PASSWORD_SUCCESS });
      },
      (err) => dispatch(resetPasswordFail(err.response.data.error))
    );
  };
};

const resetPasswordFail = (payload) => {
  return {
    type: actionTypes.RESET_PASSWORD_FAIL,
    payload,
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
  actionSuccess,
  actionFail,
  dispatch,
  getState,
  mernApi
) => {
  return mernApi.post(endpoint, payload).then(
    (response) => {
      dispatch(actionSuccess(response.data));
      redirectAfterSignIn(dispatch, getState);
      setAuthInfo(response.data, mernApi);
    },
    (err) => {
      dispatch(actionFail(err.response.data.error));
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

const redirectAfterSignIn = (dispatch, getState) => {
  if (getState().auth.attemptedPath) {
    dispatch(replace(getState().auth.attemptedPath));
    dispatch(setAttemptedPath(null));
  } else {
    dispatch(replace(getState().auth.defaultPath));
  }
};
