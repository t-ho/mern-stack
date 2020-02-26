import { AsyncStorage } from 'react-native';
import * as Facebook from 'expo-facebook';
import * as Google from 'expo-google-app-auth';
import NavService from '../../navigation/NavigationService';
import * as actionTypes from './types';

export const signUp = formValues => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.SIGN_UP });
  return mernApi.post('/auth/signup', formValues).then(
    response => {
      dispatch({ type: actionTypes.SIGN_UP_SUCCESS });
      NavService.navigate('SignIn');
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

export const signIn = formValues => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.SIGN_IN });
  return signInHelper(
    '/auth/signin',
    formValues,
    signInSuccess,
    signInFail,
    dispatch,
    mernApi
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

export const facebookSignIn = () => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.FACEBOOK_SIGN_IN });
  return Facebook.initializeAsync('1538677846308680') // TODO: Add your Facebook app ID
    .then(() => {
      return Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email']
      });
    })
    .then(response => {
      if (response.type === 'success') {
        return signInHelper(
          '/auth/facebook',
          { access_token: response.token },
          facebookSignInSuccess,
          facebookSignInFail,
          dispatch,
          mernApi
        );
      } else {
        // Simply ignore cancellation
        dispatch(facebookSignInFail());
        return Promise.resolve();
      }
    })
    .catch(err => console.log(err));
};

const facebookSignInSuccess = payload => {
  return {
    type: actionTypes.FACEBOOK_SIGN_IN_SUCCESS,
    payload
  };
};

const facebookSignInFail = payload => {
  return {
    type: actionTypes.FACEBOOK_SIGN_IN_FAIL,
    payload
  };
};

export const googleSignIn = () => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.GOOGLE_SIGN_IN });
  return Google.logInAsync({
    iosClientId:
      '134675062003-f1j19fs02f57g2pol76s1l63bo8bh065.apps.googleusercontent.com', // TODO: Add your Google iosClientId
    androidClientId:
      '134675062003-5ndljaf10rb8k3g7kqkkcg3e89kuvdr8.apps.googleusercontent.com', // TODO: Add your Google androidClientId
    scopes: ['profile', 'email']
  })
    .then(response => {
      if (response.type === 'success') {
        return signInHelper(
          '/auth/google',
          { access_token: response.accessToken },
          googleSignInSuccess,
          googleSignInFail,
          dispatch,
          mernApi
        );
      } else {
        // Simply ignore cancellation
        dispatch(googleSignInFail());
        return Promise.resolve();
      }
    })
    .catch(err => console.log(err));
};

const googleSignInSuccess = payload => {
  return {
    type: actionTypes.GOOGLE_SIGN_IN_SUCCESS,
    payload
  };
};

const googleSignInFail = payload => {
  return {
    type: actionTypes.GOOGLE_SIGN_IN_FAIL,
    payload
  };
};

export const tryLocalSignIn = () => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.TRY_LOCAL_SIGN_IN });
  getAuthInfoAsync().then(
    authInfo => {
      const now = Math.floor(Date.now() / 1000);
      if (!authInfo || (authInfo && authInfo.expiresAt <= now)) {
        dispatch(tryLocalSignInFail());
        NavService.navigate('SignInOptions');
        return Promise.resolve();
      }
      // if token age > 30 days, then refresh token
      if (authInfo.expiresAt <= now + 30 * 24 * 60 * 60) {
        mernApi.setAuthToken(authInfo.token);
        return mernApi.post('auth/refresh-token').then(
          response => {
            authInfo.token = response.data.token;
            authInfo.expiresAt = response.data.expiresAt;
            dispatch(tryLocalSignInSuccess(authInfo));
            NavService.navigate('Main');
            setAuthInfoAsync(authInfo, mernApi);
          },
          err => {
            dispatch(tryLocalSignInFail());
            NavService.navigate('SignIn');
          }
        );
      } else {
        dispatch(tryLocalSignInSuccess(authInfo));
        NavService.navigate('Main');
        return Promise.resolve();
      }
    },
    err => {
      dispatch(tryLocalSignInFail());
      NavService.navigate('SignIn');
    }
  );
};

const tryLocalSignInSuccess = payload => (dispatch, getState, { mernApi }) => {
  setAuthInfoAsync(payload, mernApi);
  dispatch({
    type: actionTypes.TRY_LOCAL_SIGN_IN_SUCCESS,
    payload
  });
};

const tryLocalSignInFail = () => (dispatch, getState, { mernApi }) => {
  clearAuthInfoAsync(mernApi);
  dispatch({ type: actionTypes.TRY_LOCAL_SIGN_IN_FAIL });
};

export const signOut = () => (dispatch, getState, { mernApi }) => {
  dispatch({ type: actionTypes.SIGN_OUT });
  clearAuthInfoAsync(mernApi);
  dispatch({ type: actionTypes.SIGN_OUT_SUCCESS });
  NavService.navigate('SignInOptions');
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

const signInHelper = (
  endpoint,
  payload,
  actionSuccess,
  actionFail,
  dispatch,
  mernApi
) => {
  return mernApi
    .post(endpoint, payload)
    .then(response => {
      dispatch(actionSuccess(response.data));
      NavService.navigate('Main');
      setAuthInfoAsync(response.data, mernApi);
    })
    .catch(err => {
      dispatch(actionFail(err.response.data.error));
    });
};

const setAuthInfoAsync = (authInfo, mernApi) => {
  mernApi.setAuthToken(authInfo.token);
  return AsyncStorage.setItem('authInfo', JSON.stringify(authInfo)).then(
    () => {},
    err => {}
  );
};

const getAuthInfoAsync = () => {
  return AsyncStorage.getItem('authInfo').then(authInfo => {
    return JSON.parse(authInfo);
  });
};

const clearAuthInfoAsync = mernApi => {
  mernApi.setAuthToken('');
  return AsyncStorage.removeItem('authInfo').then(
    () => {},
    err => {}
  );
};
