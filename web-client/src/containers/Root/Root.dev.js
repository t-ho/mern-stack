import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from '../App/App';
import DevTools from './DevTools';

const Root = ({ store }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <DevTools />
      </BrowserRouter>
    </Provider>
  );
};

export default Root;
