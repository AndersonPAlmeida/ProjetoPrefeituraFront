import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import ServiceTypeForm from './ServiceTypeForm'
import { browserHistory } from 'react-router';

class getServiceTypeEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      service_type: [],
      fetching: true
    };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `service_types/${this.props.params.service_type_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ service_type: resp, fetching: false })
    });
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
              data={this.state.service_type} 
              is_edit={true} 
              prev={this.prev}
              fetch_collection={`service_types/${this.props.params.service_type_id}`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'put'}
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
const ServiceTypeEdit = connect(
  mapStateToProps
)(getServiceTypeEdit)
export default ServiceTypeEdit
