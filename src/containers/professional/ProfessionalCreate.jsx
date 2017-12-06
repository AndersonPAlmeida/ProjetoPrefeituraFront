import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import UserForm from '../utils/UserForm'
import { browserHistory } from 'react-router';

class getProfessionalCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      professional: []
    };
  }

  prev() {
    browserHistory.push(`/professionals`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <UserForm 
              user_class={`professional`}
              is_edit={false} 
              prev={this.prev}
              fetch_collection={`/professionals`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'post'}
              submit_url={`/professionals/`}
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
const ProfessionalCreate = connect(
  mapStateToProps
)(getProfessionalCreate)
export default ProfessionalCreate
