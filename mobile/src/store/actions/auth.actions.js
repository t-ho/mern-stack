import AsyncStorage from '@react-native-async-storage/async-storage';
import SensitiveInfo from 'react-native-sensitive-info';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
import env from 'react-native-config';
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
  return LoginManager.logInWithPermissions(['public_profile', 'email'])
    .then((result) => {
      if (result.isCancelled) {
        throw new Error('Facebook sign-in cancelled');
      } else {
        return AccessToken.getCurrentAccessToken();
      }
    })
    .then((data) => {
      return signInHelper(
        '/api/auth/facebook',
        { accessToken: data.accessToken.toString() },
        actionTypes.FACEBOOK_SIGN_IN_SUCCESS,
        actionTypes.FACEBOOK_SIGN_IN_FAIL,
        dispatch,
        mernApi
      );
    })
    .then(() => {
      // Remove Facebook user session after getting JWT token from backend server
      return LoginManager.logOut();
    })
    .catch((err) => {
      // Simply ignore cancellation or error
      return Promise.resolve().then(() => {
        dispatch({ type: actionTypes.FACEBOOK_SIGN_IN_FAIL });
      });
    });
};

GoogleSignin.configure({
  webClientId: env.REACT_NATIVE_GOOGLE_WEB_CLIENT_ID,
  iosClientId: env.REACT_NATIVE_GOOGLE_IOS_CLIENT_ID,
  offlineAccess: false,
});

export const googleSignIn = () => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GOOGLE_SIGN_IN, payload: { type: 'google' } });
  return GoogleSignin.hasPlayServices()
    .then(() => {
      return GoogleSignin.signIn();
    })
    .then((response) => {
      return signInHelper(
        '/api/auth/google',
        { idToken: response.idToken },
        actionTypes.GOOGLE_SIGN_IN_SUCCESS,
        actionTypes.GOOGLE_SIGN_IN_FAIL,
        dispatch,
        mernApi
      );
    })
    .then(() => {
      // Remove Google user session after getting JWT token from backend server
      return GoogleSignin.signOut();
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

const STORAGE_KEY_JWT_TOKEN = 'jwtToken';
const STORAGE_KEY_AUTH_INFO = 'authInfo';
const sensitiveInfoOptions = {
  sharedPreferencesName: 'mernstack-app',
  keychainService: 'mernstack-app',
};

const setAuthInfoAsync = (authInfo, mernApi) => {
  const { token, ...rest } = authInfo;
  mernApi.setAuthToken(token);
  return Promise.all([
    SensitiveInfo.setItem(STORAGE_KEY_JWT_TOKEN, token, sensitiveInfoOptions),
    AsyncStorage.setItem(STORAGE_KEY_AUTH_INFO, JSON.stringify(rest)),
  ]).then(
    () => {},
    (err) => {}
  );
};

const getAuthInfoAsync = () => {
  return Promise.all([
    SensitiveInfo.getItem(STORAGE_KEY_JWT_TOKEN, sensitiveInfoOptions),
    AsyncStorage.getItem(STORAGE_KEY_AUTH_INFO).then(JSON.parse),
  ]).then(([token, authInfo]) => {
    if (token && authInfo) {
      return { ...authInfo, token };
    }
    return null;
  });
};

const clearAuthInfoAsync = (mernApi) => {
  mernApi.setAuthToken('');
  return Promise.all([
    SensitiveInfo.deleteItem(STORAGE_KEY_JWT_TOKEN, sensitiveInfoOptions),
    AsyncStorage.removeItem(STORAGE_KEY_AUTH_INFO),
  ]).then(
    () => {},
    (err) => {}
  );
};
