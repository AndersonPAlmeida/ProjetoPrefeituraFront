import React from 'react';
import { connect } from 'react-redux';
import { EmailSignUpForm } from "../../redux-auth/views/default";
import { browserHistory } from 'react-router';

class SignUp extends React.Component {
  render() {
    return (
          <div>
            <EmailSignUpForm next={() => browserHistory.push('/')} prev={() => browserHistory.push('/signup')} />
          </div>
    );
  }
}
export default connect(({ routes }) => ({ routes }))(SignUp);
