import { replace } from 'connected-react-router';
import * as actionTypes from './types';
import mernApi, { setAuthToken } from '../../apis/mern';

export const signUp = formValues => dispatch => {
  dispatch({ type: actionTypes.SIGN_UP });
  return mernApi.post('/auth/signup', formValues).then(
    response => {
      dispatch({ type: actionTypes.SIGN_UP_SUCCESS });
    },
    err => {
      dispatch(signUpFail(err.response.data.error));
    }
  );
};

const signUpFail = payload => {
  return {
    type: actionTypes.SIGN_UP_FAIL,
    payload
  };
};

export const signIn = formValues => (dispatch, getState) => {
  dispatch({ type: actionTypes.SIGN_IN });
  return mernApi.post('/auth/signin', formValues).then(
    response => {
      dispatch(signInSuccess(response.data));
      redirectAfterSignIn(dispatch, getState);
      setAuthToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('expiresAt', response.data.expiresAt);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    },
    err => {
      dispatch(signInFail(err.response.data.error));
    }
  );
};

const signInSuccess = payload => {
  return {
    type: actionTypes.SIGN_IN_SUCCESS,
    payload
  };
};

const signInFail = payload => {
  return {
    type: actionTypes.SIGN_IN_FAIL,
    payload
  };
};

const redirectAfterSignIn = (dispatch, getState) => {
  if (getState().auth.beforeSignInPath) {
    dispatch(replace(getState().auth.beforeSignInPath));
    dispatch(setBeforeSignInPath(null));
  } else {
    dispatch(replace(getState().auth.defaultPath));
  }
};

export const tryLocalSignIn = () => (dispatch, getState) => {
  dispatch({ type: actionTypes.TRY_LOCAL_SIGN_IN });
  try {
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('expiresAt');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !expiresAt || !user) {
      return dispatch(signOut);
    }
    if (expiresAt * 1000 <= Date.now()) {
      return dispatch(signOut);
    }
    dispatch(signInSuccess({ token, expiresAt, user }));
    redirectAfterSignIn(dispatch, getState);
  } catch (err) {
    dispatch(signOut);
  }
};

export const setBeforeSignInPath = path => {
  return {
    type: actionTypes.SET_BEFORE_SIGNIN_PATH,
    payload: path
  };
};

export const signOut = () => dispatch => {
  dispatch({ type: actionTypes.SIGN_OUT });
  localStorage.removeItem('token');
  localStorage.removeItem('expiresAt');
  localStorage.removeItem('user');
  dispatch({ type: actionTypes.SIGN_OUT_SUCCESS });
};

export const verifyEmail = token => dispatch => {
  dispatch({ type: actionTypes.VERIFY_EMAIL });
  return mernApi.post(`/auth/verify-email/${token}`).then(
    response => {
      dispatch({ type: actionTypes.VERIFY_EMAIL_SUCCESS });
    },
    err => {
      dispatch(verifyEmailFail(err.response.data.error));
    }
  );
};

const verifyEmailFail = payload => {
  return {
    type: actionTypes.VERIFY_EMAIL_FAIL,
    payload
  };
};

export const requestVerificationEmail = formValues => (dispatch, getState) => {
  dispatch({ type: actionTypes.REQUEST_VERIFICATION_EMAIL });
  return mernApi.post('/auth/send-token', formValues).then(
    response => {
      dispatch({ type: actionTypes.REQUEST_VERIFICATION_EMAIL_SUCCESS });
      dispatch(replace(getState().auth.defaultPath));
    },
    err => {
      dispatch(requestVerificationEmailFail(err.response.data.error));
    }
  );
};

const requestVerificationEmailFail = payload => {
  return {
    type: actionTypes.REQUEST_VERIFICATION_EMAIL_FAIL,
    payload
  };
};

export const requestPasswordReset = formValues => (dispatch, getState) => {
  dispatch({ type: actionTypes.REQUEST_PASSWORD_RESET });
  return mernApi.post('/auth/send-token', formValues).then(
    response => {
      dispatch({ type: actionTypes.REQUEST_PASSWORD_RESET_SUCCESS });
      dispatch(replace(getState().auth.defaultPath));
    },
    err => {
      dispatch(requestPasswordResetFail(err.response.data.error));
    }
  );
};

const requestPasswordResetFail = payload => {
  return {
    type: actionTypes.REQUEST_PASSWORD_RESET_FAIL,
    payload
  };
};

export const resetPassword = (formValues, token) => (dispatch, getState) => {
  dispatch({ type: actionTypes.RESET_PASSWORD });
  return mernApi.post(`/auth/reset-password/${token}`, formValues).then(
    response => {
      dispatch({ type: actionTypes.RESET_PASSWORD_SUCCESS });
      dispatch(replace(getState().auth.defaultPath));
    },
    err => dispatch(resetPasswordFail(err.response.data.error))
  );
};

const resetPasswordFail = payload => {
  return {
    type: actionTypes.RESET_PASSWORD_FAIL,
    payload
  };
};

export const unloadAuthPage = () => {
  return {
    type: actionTypes.UNLOAD_AUTH_PAGE
  };
};
