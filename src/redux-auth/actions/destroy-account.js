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

import {getDestroyAccountUrl, setCurrentEndpointKey, getDefaultEndpointKey}  from "../utils/session-storage";
import {parseResponse} from "../utils/handle-fetch-response";
import {storeCurrentEndpointKey} from "./configure";
import fetch from "../utils/fetch";

export const DESTROY_ACCOUNT_START    = "DESTROY_ACCOUNT_START";
export const DESTROY_ACCOUNT_COMPLETE = "DESTROY_ACCOUNT_COMPLETE";
export const DESTROY_ACCOUNT_ERROR    = "DESTROY_ACCOUNT_ERROR";

export function destroyAccountStart(endpoint) {
  return { type: DESTROY_ACCOUNT_START, endpoint };
}
export function destroyAccountComplete(message, endpoint) {
  return { type: DESTROY_ACCOUNT_COMPLETE, endpoint, message };
}
export function destroyAccountError(errors, endpoint) {
  return { type: DESTROY_ACCOUNT_ERROR, endpoint, errors };
}
export function destroyAccount(endpoint) {
  return dispatch => {
    dispatch(destroyAccountStart(endpoint));

    return fetch(getDestroyAccountUrl(endpoint), {method: "delete"})
      .then(parseResponse)
      .then(({message}) => {
        dispatch(destroyAccountComplete(message, endpoint));

        // revert current session endpoint to default
        let defaultEndpointKey = getDefaultEndpointKey()

        // set in store
        dispatch(storeCurrentEndpointKey(defaultEndpointKey));

        // and in session
        setCurrentEndpointKey(defaultEndpointKey);
      })
      .catch(({errors}) => dispatch(destroyAccountError(errors, endpoint)));
  };
}
