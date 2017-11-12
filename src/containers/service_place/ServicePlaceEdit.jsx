import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import ServicePlaceForm from './ServicePlaceForm'
import { browserHistory } from 'react-router';

class getServicePlaceEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      service_place: [],
      fetching: true
    };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `service_places/${this.props.params.service_place_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ service_place: resp, fetching: false })
    });
  }

  prev() {
    browserHistory.push(`/service_places`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <ServicePlaceForm 
              data={this.state.service_place} 
              is_edit={true} 
              prev={this.prev}
              fetch_collection={`service_places/${this.props.params.service_place_id}`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'put'}
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
const ServicePlaceEdit = connect(
  mapStateToProps
)(getServicePlaceEdit)
export default ServicePlaceEdit
