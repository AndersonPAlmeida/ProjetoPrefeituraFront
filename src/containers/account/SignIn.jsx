import React from 'react';
import { connect } from 'react-redux';
import { EmailSignInForm } from "../../redux-auth/views/default";
import { browserHistory } from 'react-router';
import styles from './styles/SignIn.css'
class SignIn extends React.Component {
  render() {
    return <EmailSignInForm next={() => browserHistory.push('/choose_role')} signup={() => browserHistory.push('/signup')} />
  }
}
export default SignIn;