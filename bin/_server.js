import React from 'react';
import express from 'express';
import http from 'http';
import path from 'path';
import { port, apiHost, apiPort, apiVer } from '../config/env';
import PrettyError from 'pretty-error';
import ReactDOM from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Default from '../src/layouts/Default';
import { initialize } from '../src/app';
import qs from 'query-string';
import { loadOnServer } from 'redux-connect';
global.__CLIENT__ = false;
const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
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
  const query = qs.stringify(req.query);
  const location = `${req.path}${(query.length ? `?${query}` : '')}`;
  /* Send blank page to the client and hydrates (inject the initial app state) */
  function hydrateOnClient(store) {
    res.send(`<!doctype html>${ReactDOM.renderToString(<Default assets={webpackIsomorphicTools.assets()} store={store} />)}`);
  }
  initialize({
    apiUrl,
    isServer: true,
    cookies: req.headers.cookie,
    currentLocation: location,
    userAgent: req.headers['user-agent'],
    stateData: {}
  }).then(({ store, provider, blank, routes, history }) => {
      if (blank) {
        res.send('<!doctype html><body>loading...</body>');
        return;
      }
      /* Check route matches for client requested path */
      match({ history, routes, location },
      (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
          res.redirect(redirectLocation.pathname + redirectLocation.search);
        /* There was an error in routing but server still renders and sends the scripts/store/assets to client */
        } else if (error) {
          console.error('ROUTER ERROR:', pretty.render(error));
          res.status(500);
          hydrateOnClient(store);
        /* Successful Route */
        } else if (renderProps) {
          loadOnServer({ ...renderProps, store, helpers: {} }).then(() => {
            res.status(200);
            global.navigator = { userAgent: req.headers['user-agent'] };
            res.send(`<!doctype html>${ReactDOM.renderToString(<Default apiUrl={apiUrl} assets={webpackIsomorphicTools.assets()} component={provider} store={store} />)}`);
          });
        } else {
          res.status(404).send('Not found');
        }
      });
  }).catch(e => console.log('@-->server error', e, e.stack));
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
