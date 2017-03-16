import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import createHistory from 'react-router/lib/createMemoryHistory';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import { App, Home, NotFound } from './containers';
import { PageOne, PageTwo } from './containers';
import { configure } from './redux-auth';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
function requireAuth(store, nextState, replace, next) {
  if (!store.getState().auth.getIn(['user', 'isSignedIn'])) {
    replace('/');
  }
  next();
}
export function initialize({ apiUrl, cookies, isServer, currentLocation, userAgent } = {}) {
  const reducer = require('./reducers');
  /* Start history with requested url */
  let memoryHistory = isServer ? createHistory(currentLocation) : browserHistory;
  const middleware = [
    routerMiddleware(memoryHistory),
    thunk,
  ];
  /* Create store and enhanced history (memoryHistory) */
  const store = createStore(
    reducer,
    compose(
      applyMiddleware(...middleware)
    )
  );
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers'));
    });
  }
  let history = syncHistoryWithStore(memoryHistory, store);
  const routes = (
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
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






