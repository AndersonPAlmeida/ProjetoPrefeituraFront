import React from "react";
import { hideEmailSignInErrorModal } from "../../../actions/ui";
import Modal from "./Modal";

class EmailSignInErrorModal extends React.Component {
  render () {
    {
      if(this.props.show){
        Materialize.toast("Erro ao realizar login.", 4000, "red");
      }
    }
    return (
      <div />
    );
  }
}

export default EmailSignInErrorModal;
