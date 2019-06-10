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
import ServiceTypeForm from './ServiceTypeForm'
import { browserHistory } from 'react-router';

class getServiceTypeCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      service_type: []
    };
  }

  prev() {
    browserHistory.push(`/service_types`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <ServiceTypeForm 
              is_edit={false} 
              prev={this.prev}
              fetch_collection={`service_types`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'post'}
              current_role={this.props.user.roles[this.props.user.current_role_idx]}
              submit_url={`/service_types/`}
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
const ServiceTypeCreate = connect(
  mapStateToProps
)(getServiceTypeCreate)
export default ServiceTypeCreate
