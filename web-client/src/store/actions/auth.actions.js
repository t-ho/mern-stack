import * as actionTypes from './types';
import mernApi from '../../apis/mern';

export const signUp = formValues => dispatch => {
  dispatch(signUpStart());
  return mernApi.post('/auth/signup', formValues).then(
    response => {
      dispatch(signUpSuccess(response.data));
    },
    err => {
      dispatch(signUpFail('Email is already existed'));
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
