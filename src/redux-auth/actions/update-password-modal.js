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

import {getPasswordUpdateUrl}  from "../utils/session-storage";
import {parseResponse} from "../utils/handle-fetch-response";
import fetch from "../utils/fetch";

export const UPDATE_PASSWORD_MODAL_START       = "UPDATE_PASSWORD_MODAL_START";
export const UPDATE_PASSWORD_MODAL_COMPLETE    = "UPDATE_PASSWORD_MODAL_COMPLETE";
export const UPDATE_PASSWORD_MODAL_ERROR       = "UPDATE_PASSWORD_MODAL_ERROR";
export const UPDATE_PASSWORD_MODAL_FORM_UPDATE = "UPDATE_PASSWORD_MODAL_FORM_UPDATE";

export function updatePasswordModalFormUpdate(endpoint, key, value) {
  return { type: UPDATE_PASSWORD_MODAL_FORM_UPDATE, endpoint, key, value };
}
export function updatePasswordModalStart(endpoint) {
  return { type: UPDATE_PASSWORD_MODAL_START, endpoint };
}
export function updatePasswordModalComplete(endpoint, user) {
  return { type: UPDATE_PASSWORD_MODAL_COMPLETE, endpoint, user };
}
export function updatePasswordModalError(endpoint, errors) {
  return { type: UPDATE_PASSWORD_MODAL_ERROR, endpoint, errors };
}
export function updatePasswordModal(body, endpointKey) {
  return dispatch => {
    dispatch(updatePasswordModalStart(endpointKey));

    return fetch(getPasswordUpdateUrl(endpointKey), {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "put",
      body: JSON.stringify(body)
    })
      .then(parseResponse)
      .then(({user}) => dispatch(updatePasswordModalComplete(endpointKey, user)))
      .catch(({errors}) => dispatch(updatePasswordModalError(endpointKey, errors)));
  };
}
