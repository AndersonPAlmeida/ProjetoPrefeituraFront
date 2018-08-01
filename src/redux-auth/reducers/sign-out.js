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
import * as A from "../actions/sign-out";
import { SET_ENDPOINT_KEYS } from "../actions/configure";

const initialState = {
  loading: false,
  errors: null
};

export default createReducer(Immutable.fromJS({}), {
  [SET_ENDPOINT_KEYS]: (state, {endpoints}) => state.merge(endpoints.reduce((coll, k) => {
    coll[k] = Immutable.fromJS(initialState);
    return coll;
  }, {})),

  [A.SIGN_OUT_START]: (state, {endpoint}) => state.setIn([endpoint, "loading"], true),

  [A.SIGN_OUT_COMPLETE]: (state, {endpoint}) => state.mergeDeep({
    [endpoint]: {
      loading: false,
      errors: null
    }
  }),

  [A.SIGN_OUT_ERROR]: (state, { endpoint, errors }) => {
    return state.mergeDeep({
      [endpoint]: {
        loading: false,
        errors
      }
    });
  }
});
