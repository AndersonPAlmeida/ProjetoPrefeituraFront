/*
 * This file is part of Agendador.
 *
 * Agendador is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Agendador is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Agendador.  If not, see <https://www.gnu.org/licenses/>.
 */

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
