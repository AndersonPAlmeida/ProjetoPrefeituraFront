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

import * as C from "../utils/constants";
import {getAllParams, normalizeTokenKeys} from "../utils/parse-url";
import {getOAuthUrl} from "../utils/session-storage";
import {
  setCurrentEndpointKey,
  getCurrentEndpointKey,
  getTokenValidationPath,
  persistData,
} from "../utils/session-storage";
import {storeCurrentEndpointKey} from "./configure";
import {parseResponse} from "../utils/handle-fetch-response";
import fetch from "../utils/fetch";
import _openPopup from "../utils/popup";

export const OAUTH_SIGN_IN_START    = "OAUTH_SIGN_IN_START";
export const OAUTH_SIGN_IN_COMPLETE = "OAUTH_SIGN_IN_COMPLETE";
export const OAUTH_SIGN_IN_ERROR    = "OAUTH_SIGN_IN_ERROR";

// hook for rewire
var openPopup = _openPopup;

function listenForCredentials (endpointKey, popup, provider, resolve, reject) {
  if (!resolve) {
    return new Promise((resolve, reject) => {
      listenForCredentials(endpointKey, popup, provider, resolve, reject);
    });

  } else {
    let creds;

    try {
      creds = getAllParams(popup.location);
    } catch (err) {}

    if (creds && creds.uid) {
      popup.close();
      persistData(C.SAVED_CREDS_KEY, normalizeTokenKeys(creds));
      fetch(getTokenValidationPath(endpointKey))
        .then(parseResponse)
        .then(({data}) => resolve(data))
        .catch(({errors}) => reject({errors}));
    } else if (popup.closed) {
      reject({errors: "Authentication was cancelled."})
    } else {
      setTimeout(() => {
        listenForCredentials(endpointKey, popup, provider, resolve, reject);
      }, 0);
    }
  }
}


function authenticate({endpointKey, provider, url, tab=false}) {
  let name = (tab) ? "_blank" : provider;
  let popup = openPopup(provider, url, name);
  return listenForCredentials(endpointKey, popup, provider);
}


export function oAuthSignInStart(provider, endpoint) {
  return { type: OAUTH_SIGN_IN_START, provider, endpoint };
}
export function oAuthSignInComplete(user, endpoint) {
  return { type: OAUTH_SIGN_IN_COMPLETE, user, endpoint };
}
export function oAuthSignInError(errors, endpoint) {
  return { type: OAUTH_SIGN_IN_ERROR, errors, endpoint };
}
export function oAuthSignIn({provider, params, endpointKey}) {
  return dispatch => {
    // save previous endpoint key in case of failure
    var prevEndpointKey = getCurrentEndpointKey();

    // necessary for `fetch` to recognize the response as an api request
    setCurrentEndpointKey(endpointKey);
    dispatch(storeCurrentEndpointKey(endpointKey));

    var currentEndpointKey = getCurrentEndpointKey();

    dispatch(oAuthSignInStart(provider, currentEndpointKey));

    let url = getOAuthUrl({provider, params, currentEndpointKey});

    return authenticate({endpointKey, provider, url})
      .then(user => dispatch(oAuthSignInComplete(user, currentEndpointKey)))
      .catch(({ errors }) => {
        // revert endpoint key to what it was before failed request
        setCurrentEndpointKey(prevEndpointKey);
        dispatch(storeCurrentEndpointKey(prevEndpointKey));
        dispatch(oAuthSignInError(errors, currentEndpointKey))
        throw errors;
      });
  };
}
