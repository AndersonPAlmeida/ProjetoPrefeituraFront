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

import {
  getEmailSignInUrl,
  setCurrentEndpointKey,
  getCurrentEndpointKey
} from "../utils/session-storage";
import {storeCurrentEndpointKey} from "./configure";
import {parseResponse} from "../utils/handle-fetch-response";
import fetch from "../utils/fetch";
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {userSignIn, userUpdate} from "../../actions/user"

export const EMAIL_SIGN_IN_START       = "EMAIL_SIGN_IN_START";
export const EMAIL_SIGN_IN_COMPLETE    = "EMAIL_SIGN_IN_COMPLETE";
export const EMAIL_SIGN_IN_ERROR       = "EMAIL_SIGN_IN_ERROR";
export const EMAIL_SIGN_IN_FORM_UPDATE = "EMAIL_SIGN_IN_FORM_UPDATE";

export function emailSignInFormUpdate(endpoint, key, value) {
  return { type: EMAIL_SIGN_IN_FORM_UPDATE, endpoint, key, value };
}
export function emailSignInStart(endpoint) {
  return { type: EMAIL_SIGN_IN_START, endpoint };
}
export function emailSignInComplete(endpoint, user) {
  return { type: EMAIL_SIGN_IN_COMPLETE, user, endpoint };
}
export function emailSignInError(endpoint, errors) {
  return { type: EMAIL_SIGN_IN_ERROR, errors, endpoint };
}
export function emailSignIn(body, endpointKey) {
  return dispatch => {
    // save previous endpoint key in case of failure
    var prevEndpointKey = getCurrentEndpointKey();

    // necessary for fetch to recognize the response as an api request
    setCurrentEndpointKey(endpointKey);
    var currentEndpointKey = getCurrentEndpointKey();

    dispatch(storeCurrentEndpointKey(currentEndpointKey));
    dispatch(emailSignInStart(currentEndpointKey));

    return fetch(getEmailSignInUrl(currentEndpointKey), {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "post",
      body: JSON.stringify(body)
    })
      .then(parseResponse)
      .then((user) => {
        dispatch(userSignIn(user.data))
        dispatch(emailSignInComplete(currentEndpointKey, user))
       })
      .catch((errors) => {
        // revert endpoint key to what it was before failed request
        setCurrentEndpointKey(prevEndpointKey);
        dispatch(storeCurrentEndpointKey(prevEndpointKey));
        dispatch(emailSignInError(currentEndpointKey, errors));
        throw errors;
      });
  };
}
