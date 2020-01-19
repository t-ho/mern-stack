import * as actionTypes from '../actions/types';
const INITIAL_STATE = {
  user: {},
  processing: false,
  error: ''
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.SIGN_UP:
      return { ...state, processing: true, error: '' };
    case actionTypes.SIGN_UP_SUCCESS:
      return {
        ...state,
        processing: false
      };
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
