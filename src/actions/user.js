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
