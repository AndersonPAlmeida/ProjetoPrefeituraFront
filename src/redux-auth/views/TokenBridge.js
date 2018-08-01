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

import React from "react";
import { connect } from "react-redux";

class TokenBridge extends React.Component {
  render () {
    return (
      <script id="token-bridge"
              type="application/json"
              dangerouslySetInnerHTML={{__html: this.props.initialCredentials}} />
    );
  }
}

export default connect((state) => {
  let auth = state.get('auth')
  let headers = auth.getIn(["server", "headers"]);

  return {
    initialCredentials: headers && JSON.stringify({
      user: auth.getIn(["server", "user"]),
      mustResetPassword: auth.getIn(["server", "mustResetPassword"]),
      firstTimeLogin: auth.getIn(["server", "firstTimeLogin"]),
      currentEndpointKey: auth.getIn(["configure", "currentEndpointKey"]),
      defaultEndpointKey: auth.getIn(["configure", "defaultEndpointKey"]),
      headers
    })
  };
})(TokenBridge);



