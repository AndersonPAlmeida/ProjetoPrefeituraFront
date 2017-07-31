import React from "react";
import { connect } from "react-redux";
import { hidePasswordResetRequestSuccessModal } from "../../../actions/ui";
import Modal from "./Modal";

class RequestPasswordResetSuccessModal extends React.Component {
  render () {
    return (
      <Modal
        show={this.props.show}
        containerClass="request-password-reset-success-modal"
        title="Password Reset Request Success"
        closeAction={hidePasswordResetRequestSuccessModal}>
        <p>
          {this.props.auth.getIn(["ui", "requestPasswordResetSuccessMessage"])}
        </p>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.get('auth') }
}

export default connect(mapStateToProps)(RequestPasswordResetSuccessModal)

