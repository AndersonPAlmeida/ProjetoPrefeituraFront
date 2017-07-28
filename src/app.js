import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import createHistory from 'react-router/lib/createMemoryHistory';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import { App, Home, NotFound } from './containers';
import { PageOne, PageTwo } from './containers';
import { configure } from './redux-auth';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware, routerActions } from 'react-router-redux';
import thunk from 'redux-thunk';
import Login from './containers/SignIn/Login'
import Register from './containers/SignUp/Register'
import RegisterCep from './containers/SignUp/RegisterCep'
import { UserAuthWrapper } from 'redux-auth-wrapper'
import { fromJS, Immutable } from 'immutable';

export function initialize({ apiUrl, cookies, isServer, currentLocation, userAgent, stateData } = {}) {
  const reducer = require('./reducers');
  /* Start history with requested url */
  let memoryHistory = isServer ? createHistory(currentLocation) : browserHistory;
  const middleware = [
    routerMiddleware(memoryHistory),
    thunk,
  ];
  let store;
  let finalCreateStore;
  /* Create store and enhanced history (memoryHistory) */
  if (process.env.NODE_ENV === 'development' && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('./containers/DevTools');
    store = createStore(reducer, 
                        fromJS(stateData),
                        compose(
                               applyMiddleware(...middleware),
                               global.devToolsExtension ? global.devToolsExtension() : DevTools.instrument(),
                               persistState(global.location.href.match(/[?&]debug_session=([^&]+)\b/))
                              )
                       );
  }
  else {
    finalCreateStore = applyMiddleware(...middleware)(createStore);
    store = finalCreateStore(reducer,fromJS(stateData));
  }
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers'));
    });
  }
  let history = syncHistoryWithStore(memoryHistory, store, {
    selectLocationState (state) {
      return (state.get('routing').toJS());
    }
  });
  const UserIsAuthenticated = UserAuthWrapper({
    authSelector: (state)  => { return (state.get('auth').getIn(['user','isSignedIn']) ? { 'authentication' : true } : false) },  
    redirectAction: routerActions.replace, 
    failureRedirectPath: '/',
    wrapperDisplayName: 'UserIsAuthenticated' 
  })
  const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);
  const routes = (
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Login} />
        <Route path="signup" component={RegisterCep} />
        <Route path="signup2" component={Register} />
        <Route path="pageone" component={PageOne} />
        <Route path="pagetwo" component={PageTwo} />
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
