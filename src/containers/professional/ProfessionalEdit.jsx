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

class getProfessionalEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      professional: [],
      citizen: [],
      roles: [],
      fetching: true,
      photo: null
    };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    var collection = `professionals/${this.props.params.professional_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      var professional_data = {}
      professional_data['registration'] = resp.registration
      professional_data['active'] = resp.active
      professional_data['occupation_id'] = resp.occupation_id
      var roles_data = []
      for(var i = 0; i < resp.service_places.length; i++) {
        roles_data.push(
                        {
                          service_place_id: resp.service_places[i].id,
                          role: resp.service_places[i].role
                        }
                       )  
      }
      self.setState({ 
                      citizen: resp.citizen, 
                      professional: professional_data,
                      roles: roles_data,
                   }, () => {
          collection = `citizens/${this.state.citizen.id}/picture`
          fetch(`${apiUrl}/${collection}?${params}`, {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            method: "get"
          })
            .then(resp => {
              var contentType = resp.headers.get("content-type");
              if(resp.status == 200 && contentType && contentType.indexOf("image") !== -1) {
                resp.blob().then(photo => {
                  self.setState({ photo: URL.createObjectURL(photo), fetching: false });
                })
              } else {
                self.setState({ fetching: false });
              }
          }).catch(e => {})
        }
      )
    });
  }

  prev() {
    browserHistory.push(`/professionals`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <UserForm 
              user_data={this.state.citizen} 
              roles_data={this.state.roles}
              professional_data={this.state.professional} 
              user_class={`professional`}
              is_edit={true} 
              photo={this.state.photo}
              professional_only={false}
              prev={this.prev}
              fetch_collection={`professionals/${this.props.params.professional_id}`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'put'}
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
const ProfessionalEdit = connect(
  mapStateToProps
)(getProfessionalEdit)
export default ProfessionalEdit
