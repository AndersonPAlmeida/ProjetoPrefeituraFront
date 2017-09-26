import React, {Component} from 'react';
import { connect } from 'react-redux';
import { EmailSignUpForm } from "../../redux-auth/views/default";
import { browserHistory } from 'react-router';
import {fetch} from "../../redux-auth";
import UserForm from '../utils/UserForm'

class SignUp extends Component {
  prev() {
    browserHistory.push(`/`)
  }

  render() {
    return (
      <UserForm
        user_class={`citizen`}
        is_edit={false}
        prev={this.prev}
        fetch_collection={`auth`}
        fetch_params={``}
        fetch_method={'post'}
        fetch_function={fetch}
        submit_url={`/`}
      />
    )
  }
}

export default connect(({ routes }) => ({ routes }))(SignUp);
