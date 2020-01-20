import * as actionTypes from '../actions/types';
const INITIAL_STATE = {
  user: {},
  token: null,
  processing: false,
  error: null
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.SIGN_IN:
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
    default:
      return state;
  }
};

export default authReducer;
