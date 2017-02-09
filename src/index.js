import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { createStore } from './redux/createStore';
import { initialize } from './appconfig';
const dest = global.document.getElementById('root');
const store = createStore(browserHistory, global.__data);
const history = syncHistoryWithStore(browserHistory, store);
const component = (
  <Router history={history}>
    {getRoutes(store)}
  </Router>
);
ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  </Provider>,
  dest
);
initialize({ apiUrl: window.__API_URL__ }).then(({ provider }) => {
  ReactDOM.render(
    provider,
    dest
  );
});
if (process.env.NODE_ENV !== 'production') {
  global.React = React; // enable debugger
if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}
/* render redux dev tools case in dev env */
if (__DEVTOOLS__ && !global.devToolsExtension) {
  const DevTools = require('./containers/DevTools');
  ReactDOM.render(
    <Provider store={store} key="provider">
      <div>
        {component}
        <DevTools />
      </div>
    </Provider>,
    dest
  );
}
