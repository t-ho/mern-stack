import { replace } from 'connected-react-router';
import * as actionTypes from './types';
import mernApi, { setAuthToken } from '../../apis/mern';

export const signUp = formValues => dispatch => {
  dispatch(signUpStart());
  return mernApi.post('/auth/signup', formValues).then(
    response => {
      dispatch(signUpSuccess());
    },
    err => {
      dispatch(signUpFail(err.response.data.error));
    }
  );
};

const signUpStart = () => {
  return {
    type: actionTypes.SIGN_UP
  };
};

const signUpSuccess = () => {
  return {
    type: actionTypes.SIGN_UP_SUCCESS
  };
};

const signUpFail = payload => {
  return {
    type: actionTypes.SIGN_UP_FAIL,
    payload
  };
};

export const signIn = formValues => (dispatch, getState) => {
  dispatch(signInStart());
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

const signInStart = () => {
  return {
    type: actionTypes.SIGN_IN
  };
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
  dispatch(tryLocalSignInStart());
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

const tryLocalSignInStart = () => {
  return {
    type: actionTypes.TRY_LOCAL_SIGN_IN
  };
};

export const setBeforeSignInPath = path => {
  return {
    type: actionTypes.SET_BEFORE_SIGNIN_PATH,
    payload: path
  };
};

export const signOut = () => dispatch => {
  dispatch(signOutStart());
  localStorage.removeItem('token');
  localStorage.removeItem('expiresAt');
  localStorage.removeItem('user');
  dispatch(signOutSuccess());
};

const signOutStart = () => {
  return {
    type: actionTypes.SIGN_OUT
  };
};

const signOutSuccess = () => {
  return {
    type: actionTypes.SIGN_OUT_SUCCESS
  };
};

export const verifyEmail = token => dispatch => {
  dispatch(verifyEmailStart());
  return mernApi.post(`/auth/verify-email/${token}`).then(
    response => {
      dispatch(verifyEmailSuccess());
    },
    err => {
      dispatch(verifyEmailFail(err.response.data.error));
    }
  );
};

const verifyEmailStart = () => {
  return {
    type: actionTypes.VERIFY_EMAIL
  };
};

const verifyEmailSuccess = () => {
  return {
    type: actionTypes.VERIFY_EMAIL_SUCCESS
  };
};

const verifyEmailFail = payload => {
  return {
    type: actionTypes.VERIFY_EMAIL_FAIL,
    payload
  };
};

export const requestVerificationEmail = formValues => (dispatch, getState) => {
  dispatch(requestVerificationEmailStart());
  return mernApi.post('/auth/send-token', formValues).then(
    response => {
      dispatch(requestVerificationEmailSuccess());
      dispatch(replace(getState().auth.defaultPath));
    },
    err => {
      dispatch(requestVerificationEmailFail(err.response.data.error));
    }
  );
};

const requestVerificationEmailStart = () => {
  return {
    type: actionTypes.REQUEST_VERIFICATION_EMAIL
  };
};

const requestVerificationEmailSuccess = () => {
  return {
    type: actionTypes.REQUEST_VERIFICATION_EMAIL_SUCCESS
  };
};

const requestVerificationEmailFail = payload => {
  return {
    type: actionTypes.REQUEST_VERIFICATION_EMAIL_FAIL,
    payload
  };
};

export const requestPasswordReset = formValues => (dispatch, getState) => {
  dispatch(requestPasswordResetStart());
  return mernApi.post('/auth/send-token', formValues).then(
    response => {
      dispatch(requestPasswordResetSuccess());
      dispatch(replace(getState().auth.defaultPath));
    },
    err => {
      dispatch(requestPasswordResetFail(err.response.data.error));
    }
  );
};

const requestPasswordResetStart = () => {
  return {
    type: actionTypes.REQUEST_PASSWORD_RESET
  };
};

const requestPasswordResetSuccess = () => {
  return {
    type: actionTypes.REQUEST_PASSWORD_RESET_SUCCESS
  };
};

const requestPasswordResetFail = payload => {
  return {
    type: actionTypes.REQUEST_PASSWORD_RESET_FAIL,
    payload
  };
};
