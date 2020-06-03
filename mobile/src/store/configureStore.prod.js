import { applyMiddleware, createStore } from 'redux';
import reduxThunk from 'redux-thunk';
import rootReducer from './reducers';
import { mernApi } from './apis/mern';

const configureStore = (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(reduxThunk.withExtraArgument({ mernApi }))
  );

  return store;
};

export default configureStore;
