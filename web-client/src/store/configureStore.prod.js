import { applyMiddleware, createStore } from 'redux';
import { createBrowserHistory } from 'history';
import reduxThunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from './reducers';

export const history = createBrowserHistory();

const configureStore = initialState => {
  const store = createStore(
    createRootReducer(history),
    initialState,
    applyMiddleware(routerMiddleware(history), reduxThunk)
  );

  return store;
};

export default configureStore;
