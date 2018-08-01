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
import * as A from "../actions/server";

const initialState = Immutable.fromJS({
  user: null,
  headers: null,
  firstTimeLogin: false,
  mustResetPassword: false
});

export default createReducer(initialState, {
  [A.SS_AUTH_TOKEN_UPDATE]: (state, {
    user = null,
    headers = null,
    mustResetPassword = false,
    firstTimeLogin = false
  }) => {
    return state.merge({
      user,
      headers,
      mustResetPassword,
      firstTimeLogin
    });
  }
});
