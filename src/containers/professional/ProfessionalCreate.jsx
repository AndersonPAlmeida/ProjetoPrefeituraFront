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
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import UserForm from '../utils/UserForm'
import { browserHistory } from 'react-router';

class getProfessionalCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      professional_only: false,
      cpf: ''
    };
  }

  componentDidMount() {
    self = this
    if(typeof location !== 'undefined' && location.search) {
      var search = location.search.substring(1);
      var query = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
      var q_prof_only = false
      var cpf = ''
      if(query['professional_only'] == 'true') {
        q_prof_only = true
        cpf = query['cpf']
      }
      self.setState({
        professional_only: q_prof_only,
        cpf: cpf
      })
    }
  }

  prev() {
    browserHistory.push(`/professionals`)
  }

  render() {
    return (
      <div>
        {
          <UserForm 
            user_class={`professional`}
            is_edit={false} 
            prev={this.prev}
            professional_only={this.state.professional_only}
            cpf_citizen={this.state.cpf}
            fetch_collection={`professionals`}
            fetch_params={`permission=${this.props.user.current_role}`}
            fetch_method={'post'}
            submit_url={`/professionals/`}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  return {
    user
  }
}
const ProfessionalCreate = connect(
  mapStateToProps
)(getProfessionalCreate)
export default ProfessionalCreate
