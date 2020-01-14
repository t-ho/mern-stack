import { applyMiddleware, createStore } from 'redux';
import reduxThunk from 'redux-thunk';
import rootReducer from './reducers';

const configureStore = initialState => {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(reduxThunk)
  );

  return store;
};

export default configureStore;
