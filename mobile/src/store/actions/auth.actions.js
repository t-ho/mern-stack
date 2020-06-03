import { AsyncStorage } from 'react-native';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import NavService from '../../navigation/NavigationService';
import * as actionTypes from './types';

export const signUp = (formValues) => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.SIGN_UP, payload: { type: 'email' } });
  return mernApi.post('/api/auth/signup', formValues).then(
    (response) => {
      dispatch({ type: actionTypes.SIGN_UP_SUCCESS });
      NavService.navigate('SignIn');
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
  dispatch({ type: actionTypes.SIGN_IN, payload: { type: 'email' } });
  return signInHelper(
    '/api/auth/signin',
    formValues,
    actionTypes.SIGN_IN_SUCCESS,
    actionTypes.SIGN_IN_FAIL,
    dispatch,
    mernApi
  );
};

export const facebookSignIn = () => (dispatch, getState, { mernApi }) => {
  dispatch({
    type: actionTypes.FACEBOOK_SIGN_IN,
    payload: { type: 'facebook' },
  });
  return Facebook.initializeAsync(process.env.REACT_NATIVE_FACEBOOK_APP_ID)
    .then(() => {
      return Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });
    })
    .then((response) => {
      if (response.type === 'success') {
        return signInHelper(
          '/api/auth/facebook',
          { accessToken: response.token },
          actionTypes.FACEBOOK_SIGN_IN_SUCCESS,
          actionTypes.FACEBOOK_SIGN_IN_FAIL,
          dispatch,
          mernApi
        );
      } else {
        throw new Error('Facebook sign-in cancelled');
      }
    })
    .catch((err) => {
      // Simply ignore cancellation or error
      return Promise.resolve().then(() => {
        dispatch({ type: actionTypes.FACEBOOK_SIGN_IN_FAIL });
      });
    });
};

export const googleSignIn = () => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GOOGLE_SIGN_IN, payload: { type: 'google' } });
  return Google.logInAsync({
    iosClientId: process.env.REACT_NATIVE_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.REACT_NATIVE_GOOGLE_ANDROID_CLIENT_ID,
    scopes: ['profile', 'email'],
  })
    .then((response) => {
      if (response.type === 'success') {
        return signInHelper(
          '/api/auth/google',
          { accessToken: response.accessToken },
          actionTypes.GOOGLE_SIGN_IN_SUCCESS,
          actionTypes.GOOGLE_SIGN_IN_FAIL,
          dispatch,
          mernApi
        );
      } else {
        throw new Error('Google sign-in cancelled');
      }
    })
    .catch((err) => {
      // Simply ignore cancellation or error
      return Promise.resolve().then(() => {
        dispatch({ type: actionTypes.GOOGLE_SIGN_IN_FAIL });
      });
    });
};

export const tryLocalSignIn = () => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.TRY_LOCAL_SIGN_IN });
  return getAuthInfoAsync().then(
    (authInfo) => {
      const now = Math.floor(Date.now() / 1000);
      if (!authInfo || (authInfo && authInfo.expiresAt <= now)) {
        return Promise.resolve().then(() => {
          dispatch(tryLocalSignInFail());
        });
      }
      mernApi.setAuthToken(authInfo.token);
      return mernApi
        .post('/api/auth/verify-token', { refreshToken: true })
        .then(
          (response) => {
            authInfo.token = response.data.token;
            authInfo.expiresAt = response.data.expiresAt;
            dispatch(
              signInSuccess(authInfo, actionTypes.TRY_LOCAL_SIGN_IN_SUCCESS)
            );
          },
          (err) => {
            dispatch(tryLocalSignInFail());
          }
        );
    },
    (err) => {
      dispatch(tryLocalSignInFail());
    }
  );
};

const signInSuccess = (payload, successType) => (
  dispatch,
  getState,
  { mernApi }
) => {
  setAuthInfoAsync(payload, mernApi);
  dispatch({ type: successType, payload });
  NavService.navigate('Home');
};

const tryLocalSignInFail = () => (dispatch, getState, { mernApi }) => {
  clearAuthInfoAsync(mernApi);
  dispatch({ type: actionTypes.TRY_LOCAL_SIGN_IN_FAIL });
  NavService.navigate('SignIn');
};

export const signOut = () => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.SIGN_OUT });
  clearAuthInfoAsync(mernApi);
  dispatch({ type: actionTypes.SIGN_OUT_SUCCESS });
  NavService.navigate('SignIn');
};

export const requestVerificationEmail = (formValues) => {
  return (dispatch, getState, { mernApi }) => {
    dispatch({ type: actionTypes.REQUEST_VERIFICATION_EMAIL });
    return mernApi.post('/api/auth/send-token', formValues).then(
      (response) => {
        dispatch({ type: actionTypes.REQUEST_VERIFICATION_EMAIL_SUCCESS });
        return response;
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

export const clearErrorMessage = () => {
  return {
    type: actionTypes.CLEAR_ERROR_MESSAGE,
  };
};

export const requestPasswordReset = (formValues) => {
  return (dispatch, getState, { mernApi }) => {
    dispatch({ type: actionTypes.REQUEST_PASSWORD_RESET });
    return mernApi.post('/api/auth/send-token', formValues).then(
      (response) => {
        dispatch({ type: actionTypes.REQUEST_PASSWORD_RESET_SUCCESS });
        return response;
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

export const unloadAuthScreen = () => {
  return {
    type: actionTypes.UNLOAD_AUTH_SCREEN,
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
  return mernApi
    .post(endpoint, payload)
    .then((response) => {
      dispatch(signInSuccess(response.data, successType));
    })
    .catch((err) => {
      dispatch({ type: failType, payload: err.response.data.error.message });
    });
};

const setAuthInfoAsync = (authInfo, mernApi) => {
  mernApi.setAuthToken(authInfo.token);
  return AsyncStorage.setItem('authInfo', JSON.stringify(authInfo)).then(
    () => {},
    (err) => {}
  );
};

const getAuthInfoAsync = () => {
  return AsyncStorage.getItem('authInfo').then((authInfo) => {
    return JSON.parse(authInfo);
  });
};

const clearAuthInfoAsync = (mernApi) => {
  mernApi.setAuthToken('');
  return AsyncStorage.removeItem('authInfo').then(
    () => {},
    (err) => {}
  );
};
