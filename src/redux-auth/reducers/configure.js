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
import * as A from "../actions/configure";

const initialState = Immutable.fromJS({
  loading: true,
  errors: null,
  config: null,
  endpointKeys: null,
  defaultEndpointKey: null,
  currentEndpointKey: null
});

export default createReducer(initialState, {
  [A.CONFIGURE_START]: state => state.set("loading", true),

  [A.STORE_CURRENT_ENDPOINT_KEY]: (state, {currentEndpointKey}) => state.merge({currentEndpointKey}),

  [A.SET_ENDPOINT_KEYS]: (state, {endpointKeys, defaultEndpointKey, currentEndpointKey}) => state.merge({
    endpointKeys, defaultEndpointKey, currentEndpointKey
  }),

  [A.CONFIGURE_COMPLETE]: (state, {config}) => state.merge({
    loading: false,
    errors: null,
    config
  }),

  [A.CONFIGURE_ERROR]: (state, {errors}) => state.merge({
    loading: false,
    errors
  })
});
