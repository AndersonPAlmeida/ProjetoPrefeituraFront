import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import createHistory from 'react-router/lib/createMemoryHistory';
import { createStore } from './redux/createStore';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import { App, Home, NotFound } from './containers';
import { SignIn } from './containers';
import { configure } from 'redux-auth';
function requireAuth(store, nextState, replace, next) {
  if (!store.getState().auth.getIn(['user', 'isSignedIn'])) {
    replace('/login');
  }
  next();
}
export function initialize({ apiUrl, cookies, isServer, currentLocation, userAgent } = {}) {
  /* Start history with requested url */
  let memoryHistory = isServer ? createHistory(currentLocation) : browserHistory;
  /* Create store and enhanced history (memoryHistory) */
  const store = createStore(memoryHistory);
  let history = syncHistoryWithStore(memoryHistory, store);
  const routes = (
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="login" component={SignIn} />
        <Route path="*" component={NotFound} status={404} />
      </Route>
    </Router>
  );
  return store.dispatch(configure([ { default: { apiUrl } } ], 
    { cookies, isServer, currentLocation})).then(({ redirectPath, blank } = {}) => {
    if (userAgent) {
      global.navigator = { userAgent };
    }
    return ({
      blank,
      store,
      redirectPath,
      routes,
      history,
      provider: (
        <Provider store={store} key="provider" children={routes} />
      )
    });
  });
}






