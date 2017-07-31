import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { initialize } from './app';
const dest = global.document.getElementById('root');
initialize({ apiUrl: window.__API_URL__ , stateData: global.__data }).then(({ store, provider, routes }) => {
  // render redux dev tools case in dev env 
  if (__DEVTOOLS__ && !global.devToolsExtension) {
    const DevTools = require('./containers/application/DevTools');
    ReactDOM.render(
      <Provider store={store} key="provider">
        <div>
          {routes}
          <DevTools />
        </div>
      </Provider>,
      dest
    );
  } else {
    ReactDOM.render(
      provider,
      dest
    );
  }
});
if (process.env.NODE_ENV !== 'production') {
  global.React = React; // enable debugger
if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}
