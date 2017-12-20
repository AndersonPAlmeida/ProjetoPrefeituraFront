import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../../config/env';
import {parseResponse} from "../../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../../redux-auth";
import { connect } from 'react-redux'
import UserForm from '../../utils/UserForm'
import { browserHistory } from 'react-router';

class getProfessionalUserDependantCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dependant: {}
    };
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
              user_class={`dependant`}
              is_edit={false} 
              prev={this.prev.bind(this)}
              fetch_collection={`citizens/${this.props.params.citizen_id}/dependants`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'post'}
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
const ProfessionalUserDependantCreate = connect(
  mapStateToProps
)(getProfessionalUserDependantCreate)
export default ProfessionalUserDependantCreate
