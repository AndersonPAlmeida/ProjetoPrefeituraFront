import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import UserForm from '../utils/UserForm'
import { browserHistory } from 'react-router';

class getCitizenEdit extends Component {
  prev(e) {
    e.preventDefault()
    browserHistory.push(`/citizens/schedules/history?home=true`)
  }

  render() {
    return (
      <UserForm 
        user_data={this.props.user.citizen} 
        user_class={`citizen`}
        is_edit={true} 
        prev={this.prev}
        fetch_collection={`auth`}
        fetch_params={`permission=${this.props.user.current_role}`}
        fetch_method={'put'}
        submit_url={`/citizens/schedules?home=true`}
        photo={this.props.user.image}
        current_professional={this.props.is_professional}
        professional_data={{'registration': this.props.user.registration, 'occupation_id': this.props.user.occupation_id}}
      />
    )
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  let is_professional = (user.roles && user.roles.length > 0)
  return {
    user,
    is_professional
  }
}
const CitizenEdit = connect(
  mapStateToProps
)(getCitizenEdit)
export default CitizenEdit
