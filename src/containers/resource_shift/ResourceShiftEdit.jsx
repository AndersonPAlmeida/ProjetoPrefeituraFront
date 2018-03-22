import React, {Component} from 'react';
import { Link } from 'react-router';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import { connect } from 'react-redux';
import ResourceShiftForm from './ResourceShiftForm';
import { browserHistory } from 'react-router';

class getResourceShiftEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource_shift: [],
      fetching: true
    };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_shifts/${this.props.params.resource_shift_id}`;
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ resource_shift: resp, fetching: false });
    });
  }

  prev() {
    browserHistory.push('/resource_shifts');
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <ResourceShiftForm 
              data={this.state.resource_shift} 
              is_edit={true} 
              prev={this.prev}
              fetch_collection={`resource_shifts/${this.props.params.resource_shift_id}`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'put'}
              current_role={this.props.user.roles[this.props.user.current_role_idx]}
              submit_url={'/resource_shifts/'}
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
const ResourceShiftEdit = connect(
  mapStateToProps
)(getResourceShiftEdit);
export default ResourceShiftEdit;
