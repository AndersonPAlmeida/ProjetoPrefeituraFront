import React from "react";
import PropTypes from 'prop-types';
import EmailSignInSuccessModal from "./modals/EmailSignInSuccessModal";
import EmailSignInErrorModal from "./modals/EmailSignInErrorModal";
import OAuthSignInSuccessModal from "./modals/OAuthSignInSuccessModal";
import OAuthSignInErrorModal from "./modals/OAuthSignInErrorModal";
import EmailSignUpSuccessModal from "./modals/EmailSignUpSuccessModal";
import EmailSignUpErrorModal from "./modals/EmailSignUpErrorModal";
import SignOutSuccessModal from "./modals/SignOutSuccessModal";
import SignOutErrorModal from "./modals/SignOutErrorModal";
import FirstTimeLoginSuccessModal from "./modals/FirstTimeLoginSuccessModal";
import FirstTimeLoginErrorModal from "./modals/FirstTimeLoginErrorModal";
import RequestPasswordResetErrorModal from "./modals/RequestPasswordResetErrorModal";
import RequestPasswordResetSuccessModal from "./modals/RequestPasswordResetSuccessModal";
import UpdatePasswordErrorModal from "./modals/UpdatePasswordErrorModal";
import UpdatePasswordSuccessModal from "./modals/UpdatePasswordSuccessModal";
import DestroyAccountErrorModal from "./modals/DestroyAccountErrorModal";
import DestroyAccountSuccessModal from "./modals/DestroyAccountSuccessModal";
import PasswordResetSuccessModal from "./modals/PasswordResetSuccessModal";
import TokenBridge from "../TokenBridge";
import { connect } from "react-redux";

class AuthGlobals extends React.Component {
  static propTypes = {
    signOutSuccessEnabled: PropTypes.bool,
    signOutErrorEnabled: PropTypes.bool,
    emailSignInSuccessEnabled: PropTypes.bool,
    emailSignInErrorEnabled: PropTypes.bool,
    oAuthSignInSuccessEnabled: PropTypes.bool,
    oAuthSignInErrorEnabled: PropTypes.bool,
    emailSignUpSuccessEnabled: PropTypes.bool,
    emailSignUpErrorEnabled: PropTypes.bool,
    firstTimeLoginSuccessEnabled: PropTypes.bool,
    firstTimeLoginErrorEnabled: PropTypes.bool,
    requestPasswordResetErrorEnabled: PropTypes.bool,
    requestPasswordResetSuccessEnabled: PropTypes.bool,
    updatePasswordErrorEnabled: PropTypes.bool,
    updatePasswordSuccessEnabled: PropTypes.bool,
    destroyAccountErrorEnabled: PropTypes.bool,
    destroyAccountSuccessEnabled: PropTypes.bool,
    passwordResetSuccessEnabled: PropTypes.bool,
    passwordResetErrorEnabled: PropTypes.bool
  };

  static defaultProps = {
    signOutSuccessEnabled: true,
    signOutErrorEnabled: true,
    emailSignInSuccessEnabled: true,
    emailSignInErrorEnabled: true,
    oAuthSignInSuccessEnabled: true,
    oAuthSignInErrorEnabled: true,
    emailSignUpSuccessEnabled: true,
    emailSignUpErrorEnabled: true,
    firstTimeLoginSuccessEnabled: true,
    firstTimeLoginErrorEnabled: true,
    requestPasswordResetErrorEnabled: true,
    requestPasswordResetSuccessEnabled: true,
    updatePasswordErrorEnabled: true,
    updatePasswordSuccessEnabled: true,
    destroyAccountErrorEnabled: true,
    destroyAccountSuccessEnabled: true,
    passwordResetSuccessEnabled: true,
    passwordResetErrorEnabled: true
  };

  render () {
    return (
      <div id="auth-modals">
      </div>
    );
  }
}

export default AuthGlobals
