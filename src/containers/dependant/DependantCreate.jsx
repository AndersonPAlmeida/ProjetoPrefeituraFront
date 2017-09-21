import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import UserForm from '../utils/UserForm'
import { browserHistory } from 'react-router';

class getDependantCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dependant: []
    };
  }

  prev() {
    browserHistory.push(`/dependants`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <UserForm 
              user_class={`dependant`}
              is_edit={false} 
              prev={this.prev}
              collection={`citizens/${this.props.user.citizen.id}/dependants`}
              fetch_method={'post'}
              submit_url={`/dependants/`}
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
const DependantCreate = connect(
  mapStateToProps
)(getDependantCreate)
export default DependantCreate
