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
import ShiftForm from './ShiftForm'
import { browserHistory } from 'react-router';

class getShiftEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shift: [],
      fetching: true
    };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `shifts/${this.props.params.shift_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ shift: resp, fetching: false })
    });
  }

  prev() {
    browserHistory.push(`/shifts`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <ShiftForm 
              data={this.state.shift} 
              is_edit={true} 
              prev={this.prev}
              fetch_collection={`shifts/${this.props.params.shift_id}`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'put'}
              current_role={this.props.user.roles[this.props.user.current_role_idx]}
              submit_url={`/shifts/`}
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
const ShiftEdit = connect(
  mapStateToProps
)(getShiftEdit)
export default ShiftEdit
