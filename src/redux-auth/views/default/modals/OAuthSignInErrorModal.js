import React from "react";
import Modal from "./Modal";
import { hideOAuthSignInErrorModal } from "../../../actions/ui";

class OAuthSignInErrorModal extends React.Component {
  render () {
    return (
      <Modal
        show={this.props.show}
        containerClass="oauth-sign-in-error-modal"
        closeAction={hideOAuthSignInErrorModal}
        title="OAuth Sign In Error">
      </Modal>
    );
  }
}

export default OAuthSignInErrorModal;
