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
import { port, apiHost, apiPort, apiVer } from '../../../../config/env';
import {parseResponse} from "../../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../../redux-auth";
import { connect } from 'react-redux'
import UserForm from '../../utils/UserForm'
import { browserHistory } from 'react-router';

class getCitizenEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      citizen: [],
      fetching: true,
      photo: null
    };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    var collection = `citizens/${this.props.params.citizen_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ citizen: resp }, () => {
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

  prev(e) {
    e.preventDefault()
    browserHistory.push(`/professionals/users`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> :
            <UserForm 
              user_data={this.state.citizen} 
              user_class={`citizen`}
              is_edit={true} 
              photo={this.state.photo}
              prev={this.prev}
              fetch_collection={`citizens/${this.props.params.citizen_id}`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'put'}
              submit_url={`/professionals/users`}
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
const CitizenEdit = connect(
  mapStateToProps
)(getCitizenEdit)
export default CitizenEdit
