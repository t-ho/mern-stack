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

export const signIn = formValues => dispatch => {
  dispatch(signInStart());
  return mernApi.post('/auth/signin', formValues).then(
    response => {
      dispatch(signInSuccess(response.data));
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
