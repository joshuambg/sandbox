import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import App from './app';
import createAppStore from './state/store'
import initialState from './state/initial-state';

const store = createAppStore(initialState);

ReactDOM.render(
  <Provider store={store}>
  <App />
  </Provider>,
  document.getElementById('root'),
);