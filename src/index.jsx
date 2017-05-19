/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import antdCss from 'antd/dist/antd.min.css';

import createStore from './createStore';
import App from './App';
import localCss from './style.css';

const x = [antdCss, localCss];  // eslint-disable-line

const store = createStore();


const root = (
  <Provider store={store}>
    <LocaleProvider locale={enUS}>
      <App />
    </LocaleProvider>
  </Provider>
);

ReactDOM.render(
  root,
  document.getElementById('root')
);
