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