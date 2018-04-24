import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import ResourceTypeForm from './ResourceTypeForm'
import { browserHistory } from 'react-router';

class getResourceTypeEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      resource_type: [],
      fetching: true
    };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_types/${this.props.params.resource_type_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ resource_type: resp, fetching: false })
    });
  }

  prev() {
    browserHistory.push(`/resource_types`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <ResourceTypeForm 
              data={this.state.resource_type} 
              is_edit={true} 
              prev={this.prev}
              fetch_collection={`resource_types/${this.props.params.resource_type_id}`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'put'}
              current_role={this.props.user.roles[this.props.user.current_role_idx]}
              submit_url={`/resource_types/`}
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
const ResourceTypeEdit = connect(
  mapStateToProps
)(getResourceTypeEdit)
export default ResourceTypeEdit
