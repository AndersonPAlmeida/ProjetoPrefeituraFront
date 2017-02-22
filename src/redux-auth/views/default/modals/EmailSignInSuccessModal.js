import React from "react";
import { connect } from "react-redux";
import { hideEmailSignInSuccessModal } from "../../../actions/ui";
import Modal from "./Modal";

class EmailSignInSuccessModal extends React.Component {
  render () {
    { 
      if(this.props.show){
        Materialize.toast("Bem vindo.", 4000, "green"); 
      }
    }
    return (
      <div />
    );
  }
}

export default connect(({auth}) => ({auth}))(EmailSignInSuccessModal);

