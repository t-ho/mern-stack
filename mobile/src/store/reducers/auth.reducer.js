import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
  user: {},
  isSignedIn: false,
  expiresAt: null,
  signedInWith: null,
  processing: false,
  processed: false,
  error: null,
  type: null,
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.SIGN_IN:
    case actionTypes.FACEBOOK_SIGN_IN:
    case actionTypes.GOOGLE_SIGN_IN:
    case actionTypes.TRY_LOCAL_SIGN_IN:
    case actionTypes.SIGN_OUT:
    case actionTypes.SIGN_UP:
    case actionTypes.REQUEST_VERIFICATION_EMAIL:
    case actionTypes.REQUEST_PASSWORD_RESET:
      return {
        ...state,
        processed: false,
        processing: true,
        error: null,
        type: action.payload ? action.payload.type : null,
      };
    case actionTypes.SIGN_IN_SUCCESS:
    case actionTypes.FACEBOOK_SIGN_IN_SUCCESS:
    case actionTypes.GOOGLE_SIGN_IN_SUCCESS:
    case actionTypes.TRY_LOCAL_SIGN_IN_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        isSignedIn: true,
        expiresAt: action.payload.expiresAt,
        signedInWith: action.payload.signedInWith,
        user: { ...action.payload.user },
      };
    case actionTypes.SIGN_UP_SUCCESS:
    case actionTypes.REQUEST_VERIFICATION_EMAIL_SUCCESS:
    case actionTypes.REQUEST_PASSWORD_RESET_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
      };
    case actionTypes.SIGN_IN_FAIL:
    case actionTypes.FACEBOOK_SIGN_IN_FAIL:
    case actionTypes.GOOGLE_SIGN_IN_FAIL:
    case actionTypes.SIGN_UP_FAIL:
    case actionTypes.REQUEST_VERIFICATION_EMAIL_FAIL:
    case actionTypes.REQUEST_PASSWORD_RESET_FAIL:
      return {
        ...state,
        processing: false,
        processed: true,
        error: action.payload,
      };
    case actionTypes.TRY_LOCAL_SIGN_IN_FAIL:
    case actionTypes.SIGN_OUT_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        isSignedIn: false,
        user: {},
        expiresAt: null,
      };
    case actionTypes.UNLOAD_AUTH_SCREEN:
      return {
        ...state,
        processing: false,
        processed: false,
        error: null,
        type: null,
      };
    case actionTypes.CLEAR_ERROR_MESSAGE:
      return {
        ...state,
        processed: false,
        error: null,
      };
    default:
      return state;
  }
};

export default authReducer;
