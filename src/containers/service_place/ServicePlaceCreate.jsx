import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import ServicePlaceForm from './ServicePlaceForm'
import { browserHistory } from 'react-router';

class getServicePlaceCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      service_place: []
    };
  }

  prev() {
    browserHistory.push(`/service_places`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <UserForm 
              user_class={`service_place`}
              is_edit={false} 
              prev={this.prev}
              fetch_collection={`citizens/${this.props.user.citizen.id}/service_places`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'post'}
              submit_url={`/service_places/`}
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
const ServicePlaceCreate = connect(
  mapStateToProps
)(getServicePlaceCreate)
export default ServicePlaceCreate
