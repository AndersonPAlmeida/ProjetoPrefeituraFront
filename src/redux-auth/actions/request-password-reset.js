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

import {getPasswordResetRequestUrl, getPasswordResetRedirectUrl}  from "../utils/session-storage";
import {parseResponse} from "../utils/handle-fetch-response";
import extend from "extend";
import fetch from "../utils/fetch";

export const REQUEST_PASSWORD_RESET_START       = "REQUEST_PASSWORD_RESET_START";
export const REQUEST_PASSWORD_RESET_COMPLETE    = "REQUEST_PASSWORD_RESET_COMPLETE";
export const REQUEST_PASSWORD_RESET_ERROR       = "REQUEST_PASSWORD_RESET_ERROR";
export const REQUEST_PASSWORD_RESET_FORM_UPDATE = "REQUEST_PASSWORD_RESET_FORM_UPDATE";

export function requestPasswordResetFormUpdate(endpoint, key, value) {
  return { type: REQUEST_PASSWORD_RESET_FORM_UPDATE, endpoint, key, value };
}
export function requestPasswordResetStart(endpoint) {
  return { type: REQUEST_PASSWORD_RESET_START, endpoint };
}
export function requestPasswordResetComplete(endpoint, message) {
  return { type: REQUEST_PASSWORD_RESET_COMPLETE, endpoint, message };
}
export function requestPasswordResetError(endpoint, errors) {
  return { type: REQUEST_PASSWORD_RESET_ERROR, endpoint, errors };
}
export function requestPasswordReset(body, endpoint) {
  return dispatch => {
    dispatch(requestPasswordResetStart(endpoint));

    return fetch(getPasswordResetRequestUrl(endpoint), {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "post",
      body: JSON.stringify(extend(body, {
        redirect_url: getPasswordResetRedirectUrl(endpoint)
      }))
    })
      .then(parseResponse)
      .then(({message}) => dispatch(requestPasswordResetComplete(endpoint, message)))
      .catch(({errors}) => dispatch(requestPasswordResetError(endpoint, errors)));
  };
}
