import React, {Component} from 'react';
import { Link } from 'react-router';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import { connect } from 'react-redux';
import ResourceBookingForm from './ResourceBookingForm';
import { browserHistory } from 'react-router';

class getResourceBookingEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource_booking: [],
      fetching: true
    };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_bookings/${this.props.params.resource_booking_id}`;
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ resource_booking: resp, fetching: false });
    });
  }

  prev() {
    browserHistory.push('/resource_bookings');
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <ResourceBookingForm 
              data={this.state.resource_booking} 
              is_edit={true} 
              prev={this.prev}
              fetch_collection={`resource_bookings/${this.props.params.resource_booking_id}`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'put'}
              current_role={this.props.user.roles[this.props.user.current_role_idx]}
              submit_url={'/resource_bookings/'}
            />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo']);
  return {
    user
  };
};
const ResourceBookingEdit = connect(
  mapStateToProps
)(getResourceBookingEdit);
export default ResourceBookingEdit;
