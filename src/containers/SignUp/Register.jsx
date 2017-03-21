import React from 'react';
import { connect } from 'react-redux';
import { EmailSignUpForm } from "../../redux-auth/views/default";
import { browserHistory } from 'react-router';
import styles from '../styles/SignIn.css'
class SignUp extends React.Component {
  render() {
    return <EmailSignUpForm next={() => browserHistory.push('/pageone')} />
  }
}
export default connect(({ routes }) => ({ routes }))(SignUp);
