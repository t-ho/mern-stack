import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnly';
import { createBrowserHistory } from 'history';
import reduxThunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from './reducers';
import mernApi from './apis/mern';

const composeEnhancer = composeWithDevTools({
  actionsBlacklist: ['@@redux-form'],
});
export const history = createBrowserHistory();

const configureStore = (initialState) => {
  const store = createStore(
    createRootReducer(history),
    initialState,
    composeEnhancer(
      applyMiddleware(
        routerMiddleware(history),
        reduxThunk.withExtraArgument({ mernApi })
      )
    )
  );

  return store;
};

export default configureStore;
