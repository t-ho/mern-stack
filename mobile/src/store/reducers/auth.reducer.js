import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
  user: {},
  token: null,
  expiresAt: null,
  processing: false,
  processed: false,
  error: null
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
      return { ...state, processed: false, processing: true, error: null };
    case actionTypes.SIGN_IN_SUCCESS:
    case actionTypes.FACEBOOK_SIGN_IN_SUCCESS:
    case actionTypes.GOOGLE_SIGN_IN_SUCCESS:
    case actionTypes.TRY_LOCAL_SIGN_IN_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        token: action.payload.token,
        expiresAt: action.payload.expiresAt,
        signedInWith: action.payload.signedInWith,
        user: { ...action.payload.user }
      };
    case actionTypes.SIGN_UP_SUCCESS:
    case actionTypes.REQUEST_VERIFICATION_EMAIL_SUCCESS:
    case actionTypes.REQUEST_PASSWORD_RESET_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true
      };
    case actionTypes.SIGN_IN_FAIL:
    case actionTypes.FACEBOOK_SIGN_IN_FAIL:
    case actionTypes.GOOGLE_IN_FAIL:
    case actionTypes.SIGN_UP_FAIL:
    case actionTypes.REQUEST_VERIFICATION_EMAIL_FAIL:
    case actionTypes.REQUEST_PASSWORD_RESET_FAIL:
      return {
        ...state,
        processing: false,
        processed: true,
        error: action.payload
      };
    case actionTypes.TRY_LOCAL_SIGN_IN_FAIL:
    case actionTypes.SIGN_OUT_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        token: null,
        user: {},
        expiresAt: null
      };
    case actionTypes.UNLOAD_AUTH_SCREEN:
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
