import NavService from '../../navigation/NavigationService';
import * as actionTypes from './types';

export const signIn = formValues => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.SIGN_IN });
  return mernApi.post('/auth/signin', formValues).then(
    response => {
      dispatch(signInSuccess(response.data));
      NavService.navigate('Main');
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

export const signUp = formValues => (dispatch, getState, { mernApi }) => {
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

export const requestVerificationEmail = formValues => {
  return (dispatch, getState, { mernApi }) => {
    dispatch({ type: actionTypes.REQUEST_VERIFICATION_EMAIL });
    return mernApi.post('/auth/send-token', formValues).then(
      response => {
        dispatch({ type: actionTypes.REQUEST_VERIFICATION_EMAIL_SUCCESS });
      },
      err => {
        dispatch(requestVerificationEmailFail(err.response.data.error));
      }
    );
  };
};

const requestVerificationEmailFail = payload => {
  return {
    type: actionTypes.REQUEST_VERIFICATION_EMAIL_FAIL,
    payload
  };
};

export const requestPasswordReset = formValues => {
  return (dispatch, getState, { mernApi }) => {
    dispatch({ type: actionTypes.REQUEST_PASSWORD_RESET });
    return mernApi.post('/auth/send-token', formValues).then(
      response => {
        dispatch({ type: actionTypes.REQUEST_PASSWORD_RESET_SUCCESS });
      },
      err => {
        dispatch(requestPasswordResetFail(err.response.data.error));
      }
    );
  };
};

const requestPasswordResetFail = payload => {
  return {
    type: actionTypes.REQUEST_PASSWORD_RESET_FAIL,
    payload
  };
};

export const unloadAuthScreen = () => {
  return {
    type: actionTypes.UNLOAD_AUTH_SCREEN
  };
};
