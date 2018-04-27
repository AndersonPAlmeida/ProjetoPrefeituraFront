import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import UserForm from '../utils/UserForm'
import { browserHistory } from 'react-router';

class getCitizenEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fetching: true,
      photo: null
    };
  }

  componentDidMount() {
    var self = this
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const params = `permission=${this.props.user.current_role}`
    const collection = `citizens/${this.props.user.citizen.id}/picture`

    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "get"
    })
      .then(resp => {
        var contentType = resp.headers.get("content-type");
        if(resp.status == 200 && contentType && contentType.indexOf("image") !== -1) {
          resp.blob().then(photo => {
            self.setState({ photo: URL.createObjectURL(photo), fetching: false });
          })
        } else {
          self.setState({ fetching: false });
        }
    }).catch(e => {})
  }
  
  prev(e) {
    e.preventDefault()
    browserHistory.push(`/citizens/schedules/history?home=true`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> :
            <UserForm 
              user_data={this.props.user.citizen} 
              user_class={`citizen`}
              is_edit={true} 
              current_citizen={true}
              prev={this.prev}
              fetch_collection={`auth`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'put'}
              submit_url={`/citizens/schedules/history?home=true`}
              photo={this.state.photo}
              current_professional={this.props.is_professional}
              professional_data={{'registration': this.props.user.registration, 'occupation_id': this.props.user.occupation_id}}
            />
        }
      </div>
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
