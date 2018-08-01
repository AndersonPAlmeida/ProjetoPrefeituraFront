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

import extend from "extend";
import * as C from "../utils/constants";
import {
  authenticateStart,
  authenticateComplete,
  authenticateError
} from "./authenticate";
import {
  showFirstTimeLoginSuccessModal,
  showFirstTimeLoginErrorModal,
  showPasswordResetSuccessModal,
  showPasswordResetErrorModal
} from "./ui";
import {ssAuthTokenUpdate} from "./server";
import {applyConfig} from "../utils/client-settings";
import {destroySession} from "../utils/session-storage";
import verifyAuth from "../utils/verify-auth";
import getRedirectInfo from "../utils/parse-url";
import {push} from "react-router-redux";
import {userSignIn} from "../../actions/user"

export const SET_ENDPOINT_KEYS = "SET_ENDPOINT_KEYS";
export const STORE_CURRENT_ENDPOINT_KEY = "STORE_CURRENT_ENDPOINT_KEY";
export function setEndpointKeys(endpoints, currentEndpointKey, defaultEndpointKey) {
  return { type: SET_ENDPOINT_KEYS, endpoints, currentEndpointKey, defaultEndpointKey };
};
export function storeCurrentEndpointKey(currentEndpointKey) {
  return { type: STORE_CURRENT_ENDPOINT_KEY, currentEndpointKey };
};

export function configure(endpoint={}, settings={}) {
  return dispatch => {
    // don't render anything for OAuth redirects
    if (settings.currentLocation && settings.currentLocation.match(/blank=true/)) {
      return Promise.resolve({blank: true});
    }

    dispatch(authenticateStart());

    let promise,
        firstTimeLogin,
        mustResetPassword,
        user,
        headers;

    if (settings.isServer) {
      promise = verifyAuth(endpoint, settings)
        .then(({
          user,
          headers,
          firstTimeLogin,
          mustResetPassword,
          currentEndpoint,
          currentEndpointKey,
          defaultEndpointKey
        }) => {
          dispatch(ssAuthTokenUpdate({
            headers,
            user,
            firstTimeLogin,
            mustResetPassword
          }));

          dispatch(setEndpointKeys(Object.keys(currentEndpoint), currentEndpointKey, defaultEndpointKey));

          return user;
        }).catch(({
          reason,
          firstTimeLogin,
          mustResetPassword,
          currentEndpoint,
          defaultEndpointKey
        }) => {
          dispatch(ssAuthTokenUpdate({firstTimeLogin, mustResetPassword}));
          dispatch(setEndpointKeys(Object.keys(currentEndpoint || {}), null, defaultEndpointKey));
          return Promise.reject({reason});
        });
    } else {
      // if the authentication happened server-side, find the resulting auth
      // credentials that were injected into the dom.
      let tokenBridge = document.getElementById("token-bridge");

      if (tokenBridge) {
        let rawServerCreds = tokenBridge.innerHTML;
        if (rawServerCreds) {
          let serverCreds = JSON.parse(rawServerCreds);

          ({headers, user, firstTimeLogin, mustResetPassword} = serverCreds);

          if (user) {
            dispatch(authenticateComplete(user));
            dispatch(userSignIn(user));

            // do NOT send initial validation request.
            // instead use the credentials that were sent back by the server.
            settings.initialCredentials = serverCreds;
          }

          // sync client dom to prevent React "out of sync" error
          dispatch(ssAuthTokenUpdate({
            user,
            headers,
            mustResetPassword,
            firstTimeLogin
          }));
        }
      }

      let {authRedirectPath, authRedirectHeaders} = getRedirectInfo(window.location);

      if (authRedirectPath) {
        dispatch(push({pathname: authRedirectPath}));
      }

      if (authRedirectHeaders && authRedirectHeaders.uid && authRedirectHeaders["access-token"]) {
        settings.initialCredentials = extend({}, settings.initialCredentials, authRedirectHeaders);
      }

      // if tokens were invalidated by server or from the settings, make sure
      // to clear browser credentials
      if (!settings.clientOnly && !settings.initialCredentials || settings.cleanSession) {
        destroySession();
      }

      promise = Promise.resolve(applyConfig({dispatch, endpoint, settings}));
    }

    return promise
      .then(user => {
        dispatch(authenticateComplete(user));
        dispatch(userSignIn(user));

        if (firstTimeLogin) {
          dispatch(showFirstTimeLoginSuccessModal());
        }

        if (mustResetPassword) {
          dispatch(showPasswordResetSuccessModal());
        }

        return user;
      })
      .catch(({reason} = {}) => {
        dispatch(authenticateError([reason]));

        if (firstTimeLogin) {
          dispatch(showFirstTimeLoginErrorModal());
        }

        if (mustResetPassword) {
          dispatch(showPasswordResetErrorModal());
        }

        return Promise.resolve({reason});
      });
  };
}
