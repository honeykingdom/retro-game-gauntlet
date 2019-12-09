import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import analytics from 'utils/analytics';
import App from 'app/App';
import store from 'app/store';
import * as serviceWorker from './serviceWorker';

if (process.env.NODE_ENV === 'production') {
  analytics.initialize();

  const page =
    window.location.pathname + window.location.search + window.location.hash;

  analytics.pageview(page);
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
