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

import {getEmailSignUpUrl, getSignUpCEPUrl, getConfirmationSuccessUrl}  from "../utils/session-storage";
import {parseResponse} from "../utils/handle-fetch-response";
import extend from "extend";
import fetch from "../utils/fetch";

export const EMAIL_SIGN_UP_START       = "EMAIL_SIGN_UP_START";
export const EMAIL_SIGN_UP_COMPLETE    = "EMAIL_SIGN_UP_COMPLETE";
export const EMAIL_SIGN_UP_ERROR       = "EMAIL_SIGN_UP_ERROR";
export const SIGN_UP_CEP_COMPLETE    = "SIGN_UP_CEP_COMPLETE";
export const SIGN_UP_CEP_ERROR       = "SIGN_UP_CEP_ERROR";
export const EMAIL_SIGN_UP_FORM_UPDATE = "EMAIL_SIGN_UP_FORM_UPDATE";

export function emailSignUpFormUpdate(endpoint, key, value) {
  return { type: EMAIL_SIGN_UP_FORM_UPDATE, endpoint, key, value };
}
export function emailSignUpStart(endpoint) {
  return { type: EMAIL_SIGN_UP_START, endpoint };
}
export function emailSignUpComplete(user, endpoint) {
  return { type: EMAIL_SIGN_UP_COMPLETE, user, endpoint };
}
export function emailSignUpError(errors, endpoint) {
  return { type: EMAIL_SIGN_UP_ERROR, errors, endpoint };
}
export function signUpCEPComplete(endpoint) {
  return { type: SIGN_UP_CEP_COMPLETE, endpoint };
}
export function signUpCEPError(errors, endpoint) {
  return { type: SIGN_UP_CEP_ERROR, errors, endpoint };
}
export function emailSignUp(body, endpointKey, next) {
  return dispatch => {
    dispatch(emailSignUpStart(endpointKey));
    return fetch(getEmailSignUpUrl(endpointKey), {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "post",
      body: JSON.stringify(body)
    })
      .then(parseResponse)
      .then(({data}) => 
            { 
              dispatch(emailSignUpComplete(data, endpointKey));
              next();
            }
          ) 
      .catch(({errors}) => {
        if(errors) {
          let full_error_msg = "";
          errors['full_messages'].forEach(function(elem){ full_error_msg += elem + '\n' });
          Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
          dispatch(emailSignUpError(errors, endpointKey))
          throw errors;
        }
      });
  };
}
export function signUpCEP(body, endpointKey, next) {
  return dispatch => {
    dispatch(emailSignUpStart(endpointKey));

    return fetch(getSignUpCEPUrl(endpointKey), {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "post",
      body: JSON.stringify(extend(body, {
        confirm_success_url: getConfirmationSuccessUrl()
      }))
    })
      .then(parseResponse)
      .then((data) => 
            {
              dispatch(emailSignUpFormUpdate(endpointKey, "address_street", data['address']));
              dispatch(emailSignUpFormUpdate(endpointKey, "city", data['city_name']));
              dispatch(emailSignUpFormUpdate(endpointKey, "address_complement", data['complement2']));
              dispatch(emailSignUpFormUpdate(endpointKey, "neighborhood", data['neighborhood']));
              dispatch(emailSignUpFormUpdate(endpointKey, "state", data['state_name']));
              dispatch(signUpCEPComplete(data, endpointKey));
              next();
            }
           )
      .catch(({errors}) => {
        if(errors) {
          dispatch(signUpCEPError(errors, endpointKey))
          throw errors;
        }
      });
  };
}
