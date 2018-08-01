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

import {getSignOutUrl, destroySession}  from "../utils/session-storage";
import {parseResponse} from "../utils/handle-fetch-response";
import {storeCurrentEndpointKey} from "./configure";
import fetch from "../utils/fetch";

export const SIGN_OUT_START    = "SIGN_OUT_START";
export const SIGN_OUT_COMPLETE = "SIGN_OUT_COMPLETE";
export const SIGN_OUT_ERROR    = "SIGN_OUT_ERROR";

export function signOutStart(endpoint) {
  return { type: SIGN_OUT_START, endpoint };
}
export function signOutComplete(endpoint, user) {
  return { type: SIGN_OUT_COMPLETE, user, endpoint };
}
export function signOutError(endpoint, errors) {
  return { type: SIGN_OUT_ERROR, endpoint, errors };
}
export function signOut(endpoint) {
  return dispatch => {
    dispatch(signOutStart(endpoint));

    return fetch(getSignOutUrl(endpoint), {method: "delete"})
      .then(parseResponse)
      .then((user) => {
        dispatch(signOutComplete(endpoint, user))
        dispatch(storeCurrentEndpointKey(null));
        destroySession();
      })
      .catch(({errors}) => {
        dispatch(signOutError(endpoint, errors))
        dispatch(storeCurrentEndpointKey(null));
        destroySession();
        throw errors;
      });
  };
}
