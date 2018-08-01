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
import SectorForm from './SectorForm'
import { browserHistory } from 'react-router';

class getSectorEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sector: [],
      fetching: true
    };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `sectors/${this.props.params.sector_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ sector: resp, fetching: false })
    });
  }

  prev() {
    browserHistory.push(`/sectors`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <SectorForm 
              data={this.state.sector} 
              is_edit={true} 
              prev={this.prev}
              fetch_collection={`sectors/${this.props.params.sector_id}`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'put'}
              current_role={this.props.user.roles[this.props.user.current_role_idx]}
              submit_url={`/sectors/`}
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
const SectorEdit = connect(
  mapStateToProps
)(getSectorEdit)
export default SectorEdit
