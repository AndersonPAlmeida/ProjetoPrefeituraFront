import fetch from "../redux-auth/utils/fetch";
import {parseResponse} from "../redux-auth/utils/handle-fetch-response";
import { signOut } from "../redux-auth/actions/sign-out";
import { port, apiHost, apiPort, apiVer } from '../../config/env';
import { browserHistory } from 'react-router';

export const USER_SIGN_IN = "USER_SIGN_IN";
export const USER_SIGN_OUT = "USER_SIGN_OUT";
export const USER_UPDATE = "USER_UPDATE";

export function userSignIn(user) {
  return { type: USER_SIGN_IN, user };
}

export function userSignOut() {
  return { type: USER_SIGN_OUT };
}

export function userUpdate(data) {
  return { type: USER_UPDATE, data };
}

export function userDestroySession(endpoint) {
  return dispatch => {
    dispatch(signOut(endpoint)).then(() => { 
      browserHistory.push('/')
      dispatch(userSignOut())
      localStorage.clear()
    })
  }
}

export function userUpdatePicture(user) {
  return dispatch => {
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `citizens/${user.citizen.id}/picture`;
    const params = `size=large&permission=citizen`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "get"
    }).then(resp => {
      if(resp.status != 404)
        resp.blob().then(photo => {
          dispatch(userUpdate({ 'image': URL.createObjectURL(photo)}));
        })
    })
  };
}
