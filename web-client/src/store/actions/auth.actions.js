import { replace } from 'connected-react-router';
import * as actionTypes from './types';
import mernApi, { setAuthToken } from '../../apis/mern';

export const signUp = formValues => dispatch => {
  dispatch(signUpStart());
  return mernApi.post('/auth/signup', formValues).then(
    response => {
      dispatch(signUpSuccess(response.data));
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

const signUpSuccess = payload => {
  return {
    type: actionTypes.SIGN_UP_SUCCESS,
    payload
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
  dispatch(setDefaultPath('/profile'));
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

export const setDefaultPath = path => {
  return {
    type: actionTypes.SET_DEFAULT_URL,
    payload: path
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
  dispatch(setDefaultPath('/'));
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
