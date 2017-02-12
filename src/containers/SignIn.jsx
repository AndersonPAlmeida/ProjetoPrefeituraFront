import React from 'react';
import { connect } from 'react-redux';
import { EmailSignInForm } from "../redux-auth/views/default";
import { browserHistory } from 'react-router';
class SignIn extends React.Component {
  render() {
    return <EmailSignInForm next={() => console.log("success")} />
  }
}
export default connect(({ routes }) => ({ routes }))(SignIn);
