import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../../config/env';
import {parseResponse} from "../../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../../redux-auth";
import { connect } from 'react-redux'
import UserForm from '../../utils/UserForm'
import { browserHistory } from 'react-router';

class getProfessionalUserDependantEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dependant: {},
      fetching: true
    };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `citizens/${this.props.params.citizen_id}/dependants/${this.props.params.dependant_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ dependant: resp.citizen, fetching: false })
    });
  }

  prev(e) {
    e.preventDefault()
    browserHistory.push(`/professionals/users/${this.props.params.citizen_id}`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <UserForm 
              user_data={this.state.dependant} 
              user_class={`dependant`}
              is_edit={true} 
              prev={this.prev}
              fetch_collection={`citizens/${this.props.params.citizen_id}/dependants/${this.props.params.dependant_id}`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'put'}
              submit_url={`/professionals/users/${this.props.params.citizen_id}`}
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
const ProfessionalUserDependantEdit = connect(
  mapStateToProps
)(getProfessionalUserDependantEdit)
export default ProfessionalUserDependantEdit
