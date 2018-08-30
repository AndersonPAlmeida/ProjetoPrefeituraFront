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

import React, {Component} from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import Home from './Home';
import { AuthGlobals } from "../../redux-auth/views/default";
import { Link } from 'react-router';

class getApp extends Component {
  render() {
    const footerItems = [
                          { 'name': 'Perguntas e Respostas', 'link': 'https://forum.c3sl.ufpr.br/c/cidades-digitais/agendador' },
                          { 'name': 'Contato', 'link': 'https://www.c3sl.ufpr.br/contato/' },
                          { 'name': 'Comunicar um erro', 'link': 'https://forum.c3sl.ufpr.br/c/cidades-digitais/agendador' },
                          { 'name': 'Manual', 'link': '/agendador/manual' },
                          { 'name': 'GitLab', 'link': 'https://gitlab.c3sl.ufpr.br/agendador' }
                        ]
    return (
      <div>
        <AuthGlobals />
        <Home
          footerItems={ this.props.is_authenticated ? footerItems : [ footerItems[3], footerItems[4] ] }
          showHeader={ this.props.is_authenticated ? false : true }
          showMenu={ this.props.is_authenticated ? true : false }
        >
          { this.props.children }
        </Home>
      </div>
    )
  }
}
getApp.propTypes = {
  children: PropTypes.any,
};
const mapStateToProps = (state) => {
  const is_authenticated = state.get('auth').getIn(['user', 'isSignedIn'])
  return {
    is_authenticated
  }
}
const App = connect(
  mapStateToProps
)(getApp)
export default App
