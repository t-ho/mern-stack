import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
  user: {},
  token: null,
  expiresAt: null,
  processing: false,
  processed: false,
  error: null,
  defaultPath: '/', // Used as a default redirect path
  attemptedPath: null // Used to redirect users to the page they visited before logging in
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.SIGN_IN:
    case actionTypes.OAUTH_SIGN_IN:
    case actionTypes.SIGN_OUT:
    case actionTypes.SIGN_UP:
    case actionTypes.VERIFY_EMAIL:
    case actionTypes.REQUEST_VERIFICATION_EMAIL:
    case actionTypes.REQUEST_PASSWORD_RESET:
    case actionTypes.RESET_PASSWORD:
      return { ...state, processed: false, processing: true, error: null };
    case actionTypes.SIGN_IN_SUCCESS:
    case actionTypes.OAUTH_SIGN_IN_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        token: action.payload.token,
        expiresAt: action.payload.expiresAt,
        signedInWith: action.payload.signedInWith,
        user: { ...action.payload.user },
        defaultPath: '/profile'
      };
    case actionTypes.TRY_LOCAL_SIGN_IN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        expiresAt: action.payload.expiresAt,
        signedInWith: action.payload.signedInWith,
        user: { ...action.payload.user },
        defaultPath: '/profile'
      };
    case actionTypes.SIGN_UP_SUCCESS:
    case actionTypes.VERIFY_EMAIL_SUCCESS:
    case actionTypes.REQUEST_VERIFICATION_EMAIL_SUCCESS:
    case actionTypes.REQUEST_PASSWORD_RESET_SUCCESS:
    case actionTypes.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true
      };
    case actionTypes.SIGN_IN_FAIL:
    case actionTypes.OAUTH_SIGN_IN_FAIL:
    case actionTypes.SIGN_UP_FAIL:
    case actionTypes.VERIFY_EMAIL_FAIL:
    case actionTypes.REQUEST_VERIFICATION_EMAIL_FAIL:
    case actionTypes.REQUEST_PASSWORD_RESET_FAIL:
    case actionTypes.RESET_PASSWORD_FAIL:
      return {
        ...state,
        processing: false,
        processed: true,
        error: action.payload
      };
    case actionTypes.SIGN_OUT_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        token: null,
        user: {},
        expiresAt: null,
        defaultPath: '/'
      };
    case actionTypes.TRY_LOCAL_SIGN_IN_FAIL:
      return {
        ...state,
        token: null,
        user: {},
        expiresAt: null,
        defaultPath: '/'
      };
    case actionTypes.SET_DEFAULT_URL:
      return {
        ...state,
        defaultPath: action.payload
      };
    case actionTypes.SET_ATTEMPTED_PATH:
      return {
        ...state,
        attemptedPath: action.payload
      };
    case actionTypes.UNLOAD_AUTH_PAGE:
      return {
        ...state,
        processing: false,
        processed: false,
        error: null
      };
    default:
      return state;
  }
};

export default authReducer;
