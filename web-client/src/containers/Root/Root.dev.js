import React from 'react';
import { Provider } from 'react-redux';
import App from '../App/App';
import DevTools from './DevTools';

const Root = ({ store }) => {
  return (
    <Provider store={store}>
      <div>
        <App />
        <DevTools />
      </div>
    </Provider>
  );
};

export default Root;
