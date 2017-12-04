import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import ResourceForm from './ResourceForm'
import { browserHistory } from 'react-router';

class getResourceEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      resource: [],
      fetching: true
    };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resources/${this.props.params.resource_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ resource: resp, fetching: false })
    });
  }

  prev() {
    browserHistory.push(`/resources`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <ResourceForm 
              data={this.state.resource} 
              is_edit={true} 
              prev={this.prev}
              fetch_collection={`resources/${this.props.params.resource_id}`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'put'}
              current_role={this.props.user.roles[this.props.user.current_role_idx]}
              submit_url={`/resources/`}
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
const ResourceEdit = connect(
  mapStateToProps
)(getResourceEdit)
export default ResourceEdit
