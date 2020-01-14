import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import rootReducer from './reducers';
import DevTools from '../containers/Root/DevTools';

const configureStore = initialState => {
  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(reduxThunk), DevTools.instrument())
  );

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
  }

  return store;
};

export default configureStore;
