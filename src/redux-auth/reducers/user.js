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

import Immutable from "immutable";
import { createReducer } from "redux-immutablejs";
import { getCurrentEndpointKey } from "../utils/session-storage.js"
import * as authActions from "../actions/authenticate";
import { EMAIL_SIGN_IN_COMPLETE } from "../actions/email-sign-in";
import { EMAIL_SIGN_UP_COMPLETE } from "../actions/email-sign-up";
import { SIGN_OUT_COMPLETE, SIGN_OUT_ERROR } from "../actions/sign-out";
import { OAUTH_SIGN_IN_COMPLETE } from "../actions/oauth-sign-in";
import { DESTROY_ACCOUNT_COMPLETE } from "../actions/destroy-account";
import * as ssActions from "../actions/server";
import { STORE_CURRENT_ENDPOINT_KEY, SET_ENDPOINT_KEYS } from "../actions/configure";

const initialState = Immutable.fromJS({
  attributes: null,
  isSignedIn: false,
  firstTimeLogin: false,
  mustResetPassword: false,
  endpointKey: null
});

export default createReducer(initialState, {
  [authActions.AUTHENTICATE_COMPLETE]: (state, { user }) => state.merge({
    attributes: user,
    isSignedIn: true,
    endpointKey: getCurrentEndpointKey()
  }),

  [ssActions.SS_TOKEN_VALIDATION_COMPLETE]: (state, { user, mustResetPassword, firstTimeLogin }) => {
    return state.merge({
      attributes: user,
      isSignedIn: true,
      firstTimeLogin,
      mustResetPassword
    });
  },

  [STORE_CURRENT_ENDPOINT_KEY]: (state, {currentEndpointKey}) => state.set("endpointKey", currentEndpointKey),
  [SET_ENDPOINT_KEYS]: (state, {currentEndpointKey}) => state.set("endpointKey", currentEndpointKey),

  [EMAIL_SIGN_IN_COMPLETE]: (state, { endpoint, user }) => state.merge({
    attributes: user.data,
    isSignedIn: true,
    endpointKey: endpoint
  }),

  [EMAIL_SIGN_UP_COMPLETE]: (state, { endpoint, user }) => {
    // if registration does not require confirmation, user will be signed in at
    // this point.
    return (user.uid)
      ? state.merge({
        attributes: user,
        endpointKey: endpoint
      })
      : state;
  },

  [OAUTH_SIGN_IN_COMPLETE]: (state, { endpoint, user }) => state.merge({
    attributes: user,
    isSignedIn: true,
    endpointKey: endpoint
  }),

  [ssActions.SS_AUTH_TOKEN_UPDATE]: (state, {user, mustResetPassword, firstTimeLogin}) => {
    return state.merge({
      mustResetPassword,
      firstTimeLogin,
      isSignedIn: !!user,
      attributes: user
    });
  },

  [authActions.AUTHENTICATE_FAILURE]:    state => state.merge(initialState),
  [ssActions.SS_TOKEN_VALIDATION_ERROR]: state => state.merge(initialState),
  [SIGN_OUT_COMPLETE]:                   state => state.merge(initialState),
  [SIGN_OUT_ERROR]:                      state => state.merge(initialState),
  [DESTROY_ACCOUNT_COMPLETE]:            state => state.merge(initialState)
});
