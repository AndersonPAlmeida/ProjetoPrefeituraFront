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

import * as C from "./constants";
import extend from "extend";

// base endpoint that other endpoints extend from
const defaultEndpoint = {
  apiUrl:                "/api",
  signOutPath:           "/auth/sign_out",
  emailSignInPath:       "/auth/sign_in",
  emailRegistrationPath: "/auth",
  accountUpdatePath:     "/auth",
  accountDeletePath:     "/auth",
  passwordResetPath:     "/auth/password",
  passwordUpdatePath:    "/auth/password",
  tokenValidationPath:   "/auth/validate_token",

  authProviderPaths: {
    github:    "/auth/github",
    facebook:  "/auth/facebook",
    google:    "/auth/google_oauth2"
  }
};

function getFirstObjectKey (obj) {
  for (var key in obj) {
    return key;
  }
};

export default function parseEndpointConfig(endpoint, defaultEndpointKey = null) {
  // normalize so opts is always an array of objects
  if (endpoint.constructor !== Array) {
    // single config will always be called 'default' unless set
    // by previous session
    defaultEndpointKey = C.INITIAL_CONFIG_KEY;

    // config should look like {default: {...}}
    var defaultConfig = {};
    defaultConfig[defaultEndpointKey] = endpoint;

    // endpoint should look like [{default: {...}}]
    endpoint = [defaultConfig];
  }

  let currentEndpoint = {};

  // iterate over config items, extend each from defaults
  for (var i = 0; i < endpoint.length; i++) {
    var configName = getFirstObjectKey(endpoint[i]);

    // set first as default config
    if (!defaultEndpointKey) {
      defaultEndpointKey = configName;
    }

    // save config to `configs` hash
    currentEndpoint[configName] = extend(
      {}, defaultEndpoint, endpoint[i][configName]
    );
  }

  return {defaultEndpointKey, currentEndpoint};
}
