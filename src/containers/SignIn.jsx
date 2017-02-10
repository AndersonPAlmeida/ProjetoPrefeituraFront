import React from 'react';
import { connect } from 'react-redux';
import { EmailSignInForm } from 'redux-auth';
import { browserHistory } from 'react-router';

class SignIn extends React.Component {
  render() {
    return (
      <div>
        <EmailSignInForm next={() => browserHistory.push('/')} />
      </div>
    );
  }
}
export default connect(({ routes }) => ({ routes }))(SignIn);
