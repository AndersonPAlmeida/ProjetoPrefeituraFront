import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
function createStore(history, data) {
  const reducer = require('../reducers');
  const reduxRouterMiddleware = routerMiddleware(history);
  const middleware = [
    reduxRouterMiddleware,
    thunk,
  ];
  /* 
    applyMiddleware has format createStore => createStore' 
    Another way to apply it is by passing createStore as the last enhancer argument
    let store = createStore(reducer, preloaderState, applyMiddleware(..middleware))
    Remember that middleware is some code you can put between the framework 
    receiving a request, and the framework generating a response.
  */  
  let finalCreateStore;
  if (process.env.NODE_ENV === 'development' && __CLIENT__ && __DEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('../containers/DevTools');
   /*
      Here in development, we will apply devtools to state too 
    */
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      global.devToolsExtension ? global.devToolsExtension() : DevTools.instrument(),
      persistState(global.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore);
  } else {
   finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }
  const store = finalCreateStore(reducer, data);
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers'));
    });
  }
  return store;
}
module.exports = {
  createStore,
};
