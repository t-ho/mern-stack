import * as actionTypes from '../actions/types';

const INITIAL_STATE = {
  user: {},
  token: null,
  expiresAt: null,
  processing: false,
  defaultPath: '/', // Used as a default redirect path
  beforeSignInPath: null, // Used to redirect users to the page they visited before logging in
  error: null
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.SIGN_IN:
    case actionTypes.TRY_LOCAL_SIGN_IN:
    case actionTypes.SIGN_OUT:
    case actionTypes.SIGN_UP:
      return { ...state, processing: true, error: null };
    case actionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        processing: false,
        token: action.payload.token,
        expiresAt: action.payload.expiresAt,
        user: { ...action.payload.user }
      };
    case actionTypes.SIGN_UP_SUCCESS:
      return {
        ...state,
        processing: false
      };
    case actionTypes.SIGN_IN_FAIL:
    case actionTypes.SIGN_UP_FAIL:
      return {
        ...state,
        processing: false,
        error: action.payload
      };
    case actionTypes.SIGN_OUT_SUCCESS: {
      return {
        ...state,
        processing: false,
        token: null,
        user: {},
        expiresAt: null
      };
    }
    case actionTypes.SET_DEFAULT_URL: {
      return {
        ...state,
        user: { ...state.user },
        defaultPath: action.payload
      };
    }
    case actionTypes.SET_BEFORE_SIGNIN_PATH: {
      return {
        ...state,
        user: { ...state.user },
        beforeSignInPath: action.payload
      };
    }
    default:
      return state;
  }
};

export default authReducer;
