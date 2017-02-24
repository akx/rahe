/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import createStore from './createStore';
import App from './App';

import antdCss from 'antd/dist/antd.min.css';  // eslint-disable-line
import localCss from './style.css';  // eslint-disable-line

const store = createStore();


const root = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(
  root,
  document.getElementById('root')
);
