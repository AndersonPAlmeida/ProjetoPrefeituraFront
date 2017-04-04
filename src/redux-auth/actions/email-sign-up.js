import {getSignUpCEPUrl, getConfirmationSuccessUrl}  from "../utils/session-storage";
import {parseResponse} from "../utils/handle-fetch-response";
import extend from "extend";
import fetch from "../utils/fetch";

export const EMAIL_SIGN_UP_START       = "EMAIL_SIGN_UP_START";
export const EMAIL_SIGN_UP_COMPLETE    = "EMAIL_SIGN_UP_COMPLETE";
export const EMAIL_SIGN_UP_ERROR       = "EMAIL_SIGN_UP_ERROR";
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
export function SignUpCEPComplete(user, endpoint) {
  return { type: SIGN_UP_CEP_COMPLETE, user, endpoint };
}
export function SignUpCEPError(errors, endpoint) {
  return { type: SIGN_UP_CEP_ERROR, errors, endpoint };
}
export function emailSignUp(body, endpointKey) {
  return dispatch => {
    dispatch(emailSignUpStart(endpointKey));

    return fetch(getEmailSignUpUrl(endpointKey), {
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
      .then(({data}) => dispatch(emailSignUpComplete(data, endpointKey)))
      .catch(({errors}) => {
        if(errors) {
          dispatch(emailSignUpError(errors, endpointKey))
          throw errors;
        }
      });
  };
}
export function signUpCEP(body, endpointKey) {
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
      .then(({data}) => dispatch(signUpCEPComplete(data, endpointKey)))
      .catch(({errors}) => {
        if(errors) {
          dispatch(signUpCEPError(errors, endpointKey))
          throw errors;
        }
      });
  };
}
