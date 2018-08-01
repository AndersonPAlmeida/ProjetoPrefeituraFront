{/*
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
  */}

import React, {Component} from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import UserForm from '../utils/UserForm'

class SignUp extends Component {
  prev() {
    browserHistory.push(`/`)
  }

  render() {
    return (
      <UserForm
        user_class={`citizen`}
        is_edit={false}
        prev={this.prev}
        fetch_collection={`auth`}
        fetch_params={``}
        fetch_method={'post'}
        submit_url={`/`}
      />
    )
  }
}

export default connect(({ routes }) => ({ routes }))(SignUp);
