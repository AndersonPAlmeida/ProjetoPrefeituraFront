import React, { PropTypes } from "react";
import Input from "./Input";
import ButtonLoader from "./ButtonLoader";
import { emailSignUpFormUpdate, emailSignUp } from "../../actions/email-sign-up";
import { connect } from "react-redux";


class EmailSignUpForm extends React.Component {
  static propTypes = {
    endpoint: PropTypes.string,
    next: PropTypes.func,
    icon: PropTypes.string,
    inputProps: PropTypes.shape({
      cpf: PropTypes.object,
      password: PropTypes.object,
      passwordConfirmation: PropTypes.object,
      submit: PropTypes.object
    })
  };

  static defaultProps = {
    next: () => {},
    inputProps: {
      cpf: {},
      password: {},
      submit: {}
    }
  };

  getEndpoint () {
    return (
      this.props.endpoint ||
      this.props.auth.getIn(["configure", "currentEndpointKey"]) ||
      this.props.auth.getIn(["configure", "defaultEndpointKey"])
    );
  }

  handleInput (key, val) {
    this.props.dispatch(emailSignUpFormUpdate(this.getEndpoint(), key, val));
  }

  handleSubmit (event) {
    console.log("submitting form to endpoint", this.getEndpoint());
    event.preventDefault();
    let formData = this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form"]).toJS();
    this.props.dispatch(emailSignUp(formData, this.getEndpoint()))
      .then(this.props.next)
      .catch(() => {});
  }

  render () {
    let disabled = (
      this.props.auth.getIn(["user", "isSignedIn"]) ||
      this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "loading"])
    );

    return (
      <form className='redux-auth email-sign-up-form'
            style={{clear: "both", overflow: "hidden"}}
            onSubmit={this.handleSubmit.bind(this)}>
        <Input type="text"
               label="CPF"
               mask="111.111.111-11"
               className="email-sign-up-email"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "cpf"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "cpf"])}
               onChange={this.handleInput.bind(this, "cpf")}
               {...this.props.inputProps.cpf} />

        <Input type="password"
               label="Senha"
               className="email-sign-up-password"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "password"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "password"])}
               onChange={this.handleInput.bind(this, "password")}
               {...this.props.inputProps.password} />

        <Input type="password"
               label="Confirmação de Senha"
               className="email-sign-up-password-confirmation"
               disabled={disabled}
               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "password_confirmation"])}
               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "password_confirmation"])}
               onChange={this.handleInput.bind(this, "password_confirmation")}
               {...this.props.inputProps.passwordConfirmation} />

        { this.props.children }

        <div className='card-action'>
          <ButtonLoader loading={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "loading"])}
                        type="submit"
                        className="email-sign-up-submit back-bt waves-effect right"
                        primary={true}
                        style={{float: "right"}}
                        icon={this.props.icon}
                        disabled={disabled}
                        onClick={this.handleSubmit.bind(this)}
                        {...this.props.inputProps.submit}>
            Criar Conta
          </ButtonLoader>
          <a className='back-bt waves-effect btn-flat'> Voltar </a>
        </div>
      </form>
    );
  }
}

export default connect(({auth}) => ({auth}))(EmailSignUpForm);
