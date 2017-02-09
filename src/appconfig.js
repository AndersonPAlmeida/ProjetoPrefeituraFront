import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import createHistory from 'react-router/lib/createMemoryHistory';
import { createStore } from './redux/createStore';
import { IndexRoute, Route } from 'react-router';
import { App, Home, NotFound } from './containers';
import { AuthGlobals } from 'redux-auth';
import { configure } from 'redux-auth';
class AppConfig extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };
  render() {
    return (
      <div>
        <AuthGlobals />
        {this.props.children}
      </div>
    );
  }
}
function requireAuth(store, nextState, replace, next) {
  if (!store.getState().auth.getIn(['user', 'isSignedIn'])) {
    replace('/login');
  }
  next();
}
export function initialize({ apiUrl, cookies, isServer, currentLocation, userAgent } = {}) {
  /* Start history with requested url */
  const memoryHistory = createHistory(currentLocation);
  /* Create store and enhanced history (memoryHistory) */
  const store = createStore(memoryHistory);
  const history = syncHistoryWithStore(memoryHistory, store);
  const routes = (
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="*" component={NotFound} status={404} />
    </Route>
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






