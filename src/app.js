import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import createHistory from 'react-router/lib/createMemoryHistory';
import { createStore } from './redux/createStore';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import { App, Home, NotFound } from './containers';
import { PageOne, PageTwo } from './containers';
import { configure } from './redux-auth';
import Login from './containers/Login'
import SignUpForm from './containers/SignUpForm.js'
import SignUp from './containers/SignUp.js'
function requireAuth(store, nextState, replace, next) {
  if (!store.getState().auth.getIn(['user', 'isSignedIn'])) {
    replace('/');
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
        <IndexRoute component={Login} />
        <Route path="signup" component={SignUp} />
        <Route path="signup2" component={SignUpForm} />
        <Route onEnter={requireAuth.bind(this, store)} path="pageone" component={PageOne} />
        <Route onEnter={requireAuth.bind(this, store)} path="pagetwo" component={PageTwo} />
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






