import { createStore, applyMiddleware, compose } from 'redux';
import { createBrowserHistory } from 'history';
import reduxThunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from './reducers';
import DevTools from '../containers/Root/DevTools';

export const history = createBrowserHistory();

const configureStore = initialState => {
  const store = createStore(
    createRootReducer(history),
    initialState,
    compose(
      applyMiddleware(routerMiddleware(history), reduxThunk),
      DevTools.instrument()
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
