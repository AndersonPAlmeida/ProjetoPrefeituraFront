import React from "react";
import PropTypes from 'prop-types';
import TokenBridge from "../TokenBridge";
import { connect } from "react-redux";

class AuthGlobals extends React.Component {
  render () {
    return (
      <div id="auth-modals">
        <TokenBridge />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.get('auth') }
}

export default connect(mapStateToProps)(AuthGlobals)
