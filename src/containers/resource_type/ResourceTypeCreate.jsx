import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import ResourceType from './ResourceTypeForm'
import { browserHistory } from 'react-router';

class getResourceTypeCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sector: []
    };
  }

  prev() {
    browserHistory.push(`/resource_types`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <ResourceType 
              is_edit={false} 
              prev={this.prev}
              fetch_collection={`resource_types`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'post'}
              submit_url={`/resource_types/`}
              current_role={this.props.user.roles[this.props.user.current_role_idx]}
              city_hall_id={this.props.user.roles[this.props.user.current_role_idx].city_hall_id}
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
const ResourceTypeCreate = connect(
  mapStateToProps
)(getResourceTypeCreate)
export default ResourceTypeCreate
