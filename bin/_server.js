import express from 'express';
import http from 'http';
import path from 'path';
import { port } from '../config/env';
import PrettyError from 'pretty-error';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import createHistory from 'react-router/lib/createMemoryHistory';
import { Provider } from 'react-redux';
import {
  createStore,
} from '../src/redux/createStore';
import getRoutes from '../src/routes';
import Default from '../src/layouts/Default';
global.__CLIENT__ = false;
const apiUrl = 'http://${apiHost}:${apiPort}';
const app = express();
const server = http.Server(app);
/* Set ../public as default static files path (not used at the moment) */
app.use('/', express.static(path.resolve(__dirname, '../public')));
/* Do this callback everytime a request comes to the server */
app.use((req, res) => {
  /* Clear require cache for hot reloading to work (works at dev only) */
  if (process.env.NODE_ENV === 'development') {
    webpackIsomorphicTools.refresh();
  }
  const memoryHistory = createHistory(req.originalUrl);
  const store = createStore(memoryHistory);
  const history = syncHistoryWithStore(memoryHistory, store);
  /* Send blank page to the client and hydrates (inject the initial app state) */
  function hydrateOnClient() {
    res.send(`<!doctype html>${ReactDOM.renderToString(<Default assets={webpackIsomorphicTools.assets()} store={store} />)}`);
  }
  /* Check route matches for client requested path */
  match({ history, routes: getRoutes(store), location: req.originalUrl },
  (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    /* There was an error in routing but server still renders and sends the scripts/store/assets to client */
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    /* Successful Route */
    } else if (renderProps) {
      /* 
        Create component containing the store with Provider (which allows containers to access store),
        and the routes with the given requested route to render 
      */
      const component = (
        <Provider store={store} key="provider">
          <RouterContext {...renderProps} />
        </Provider>
      );
      res.status(200);
      global.navigator = { userAgent: req.headers['user-agent'] };
      /* 
        Send rendered page with scripts/store/assets to the client (server side rendering)
        After this, the client will keep up with rendering (universal/isomorphism)
       */
      res.send(`<!doctype html>${ReactDOM.renderToStaticMarkup(<Default assets={webpackIsomorphicTools.assets()} component={component} store={store} />)}`);
    } else {
      res.status(404).send('Not found');
    }
  });
});
app.listen(port, 
  (err) => { 
    if(err) { 
      console.error(err); 
    } else { 
      console.info(`Server listening on port ${port}!`);
    }
  }
);
