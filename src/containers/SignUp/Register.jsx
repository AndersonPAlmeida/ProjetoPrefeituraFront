import React from 'react';
import { connect } from 'react-redux';
import { EmailSignUpForm } from "../../redux-auth/views/default";
import { browserHistory } from 'react-router';
import Home from '../Home';

class SignUp extends React.Component {
  render() {
    return (
          <Home>
            <EmailSignUpForm next={() => browserHistory.push('/pageone')} />
          </Home>
    );
  }
}
export default connect(({ routes }) => ({ routes }))(SignUp);
