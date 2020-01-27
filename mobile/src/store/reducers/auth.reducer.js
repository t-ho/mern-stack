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
      return { ...state, processed: false, processing: true, error: null };
    case actionTypes.SIGN_IN_SUCCESS:
      return {
        ...state,
        processing: false,
        processed: true,
        token: action.payload.token,
        expiresAt: action.payload.expiresAt,
        user: { ...action.payload.user }
      };
    case actionTypes.SIGN_IN_FAIL:
      return {
        ...state,
        processing: false,
        processed: true,
        error: action.payload
      };
    default:
      return state;
  }
};

export default authReducer;
