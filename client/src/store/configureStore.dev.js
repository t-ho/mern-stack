import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
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

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('./reducers', () =>
      store.replaceReducer(createRootReducer(history))
    );
  }

  return store;
};

export default configureStore;
