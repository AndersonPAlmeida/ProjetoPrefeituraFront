import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import createHistory from 'react-router/lib/createMemoryHistory';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import { App, Home, NotFound, Login, Register, RegisterCep, PageOne, ChooseRole } from './containers';
import { configure } from './redux-auth';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware, routerActions } from 'react-router-redux';
import thunk from 'redux-thunk';
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
    const DevTools = require('./containers/application/DevTools');
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
    authSelector: (state)  => { return (state.get('auth').getIn(['user','isSignedIn']) ? { 'authentication' : true } : null ) },
    redirectAction: routerActions.replace, 
    failureRedirectPath: '/',
    wrapperDisplayName: 'UserIsAuthenticated' 
  })
  const UserIsNotAuthenticated = UserAuthWrapper({
    authSelector: (state)  => { return (!(state.get('auth').getIn(['user','isSignedIn'])) ? { 'authentication' : true } : null ) },
    redirectAction: routerActions.replace, 
    failureRedirectPath: '/pageone',
    wrapperDisplayName: 'UserIsNotAuthenticated' 
  })
  const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);
  const routes = (
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={UserIsNotAuthenticated(Login)} />
        <Route path="signup" component={UserIsNotAuthenticated(RegisterCep)} />
        <Route path="signup2" component={UserIsNotAuthenticated(Register)} />
        <Route path="pageone" component={UserIsAuthenticated(PageOne)} />
        <Route path="choose_role" component={UserIsAuthenticated(ChooseRole)} />
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
