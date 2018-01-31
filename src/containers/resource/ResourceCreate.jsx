import React, {Component} from 'react';
import { Link } from 'react-router';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import { connect } from 'react-redux';
import ResourceForm from './ResourceForm';
import { browserHistory } from 'react-router';

class getResourceCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sector: []
    };
  }

  prev() {
    browserHistory.push('/resources');
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <ResourceForm 
              is_edit={false} 
              prev={this.prev}
              fetch_collection={'resources'}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'post'}
              submit_url={'/resources/'}
              current_role={this.props.user.roles[this.props.user.current_role_idx]}
              city_hall_id={this.props.user.roles[this.props.user.current_role_idx].city_hall_id}
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
const ResourceCreate = connect(
  mapStateToProps
)(getResourceCreate);
export default ResourceCreate;
