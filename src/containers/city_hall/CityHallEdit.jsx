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
import { Link } from 'react-router';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import UserForm from '../utils/UserForm';
import { browserHistory } from 'react-router';
import CityHallForm from './CityHallForm'

class getCityHallEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      city_hall: [],
      fetching: true
    };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    let collection = `city_halls/${this.props.params.city_hall_id}`;

    if(this.props.user.roles[this.props.user.current_role_idx].role === 'adm_prefeitura'){
      collection = `city_halls/${this.props.user.roles[this.props.user.current_role_idx].city_hall_id}`;

    }
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ city_hall: resp, fetching: false });
    });
  }

  prev() {
    browserHistory.push(`/city_hall`);
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> :
            <CityHallForm
              data={this.state.city_hall}
              is_edit={true}
              prev={this.prev}
              fetch_collection={`city_halls/${this.state.city_hall.id}`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'put'}
              current_role={this.props.user.roles[this.props.user.current_role_idx]}
              submit_url={
                this.props.user.roles[this.props.user.current_role_idx].role === 'adm_c3sl' ?
                '/city_hall'
                :
                `/professionals/shifts?home=true`
              }
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
const CityHallEdit = connect(
  mapStateToProps
)(getCityHallEdit)
export default CityHallEdit
