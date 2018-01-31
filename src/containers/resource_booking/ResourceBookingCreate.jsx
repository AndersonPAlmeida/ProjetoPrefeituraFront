import React, {Component} from 'react';
import { Link } from 'react-router';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import { connect } from 'react-redux';
import ResourceBookingForm from './ResourceBookingForm';
import ResourceBookingCitizen from './ResourceBookingCitizen';
import { browserHistory } from 'react-router';

class getResourceBookingCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sector: []
    };
    this.formRender = this.formRender.bind(this);
  }

  prev() {
    browserHistory.push('/resource_bookings');
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            this.formRender()
        }
      </div>
    );
  }

  formRender(){
    if(this.props.user.current_role != 'citizen')
      return(
        <ResourceBookingForm 
          is_edit={false} 
          prev={this.prev}
          fetch_collection={'resource_bookings'}
          fetch_params={`permission=${this.props.user.current_role}`}
          fetch_method={'post'}
          submit_url={'/resource_bookings/'}
          current_role={this.props.user.roles[this.props.user.current_role_idx]}
          current_citizen={this.props.user.citizen}
          city_hall_id={
            this.props.user.current_role_idx == -1 ? 
              this.props.user.citizen.city_id
              :
              this.props.user.roles[this.props.user.current_role_idx].city_hall_id}
        />
      );
    else
      return(
        <ResourceBookingCitizen
          is_edit={false} 
          prev={this.prev}
          fetch_collection={'resource_bookings'}
          fetch_params={'permission=citizen'}
          fetch_method={'post'}
          submit_url={'/resource_bookings/'}
          current_role={this.props.user.roles[this.props.user.current_role_idx]}
          current_citizen={this.props.user.citizen}
          city_hall_id={
            this.props.user.current_role_idx == -1 ? 
              this.props.user.citizen.city_id
              :
              this.props.user.roles[this.props.user.current_role_idx].city_hall_id}
        />
      );
  }

}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo']);
  return {
    user
  };
};
const ResourceBookingCreate = connect(
  mapStateToProps
)(getResourceBookingCreate);
export default ResourceBookingCreate;