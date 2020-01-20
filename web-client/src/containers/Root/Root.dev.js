import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import App from '../App/App';
import DevTools from './DevTools';

const Root = ({ store, history }) => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
        <DevTools />
      </ConnectedRouter>
    </Provider>
  );
};

export default Root;
