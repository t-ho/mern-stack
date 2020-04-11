import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { connectRouter } from 'connected-react-router';
import authReducer from './auth.reducer';

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    form: formReducer,
    auth: authReducer,
  });

export default createRootReducer;
