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

import React from 'react';
import { connect } from 'react-redux';
import { EmailSignInForm } from "../../redux-auth/views/default";
import { browserHistory } from 'react-router';
import styles from './styles/SignIn.css'
class SignIn extends React.Component {
  render() {
    return <EmailSignInForm next={() => browserHistory.push('/choose_role')}
      signup={() => browserHistory.push('/signup')} newPassword={() => browserHistory.push('/password')}/>
  }
}
export default SignIn;
