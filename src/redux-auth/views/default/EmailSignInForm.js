import React, { PropTypes } from "react";
import ButtonLoader from "./ButtonLoader";
import Input from "./Input";
import { emailSignInFormUpdate, emailSignIn } from "../../actions/email-sign-in";
import styles from "../../../containers/styles/SignIn.css";
import { connect } from "react-redux";
import MaskedInput from 'react-maskedinput';


class EmailSignInForm extends React.Component {
  static propTypes = {
    endpoint: PropTypes.string,
    next: PropTypes.func,
    inputProps: PropTypes.shape({
      cpf: PropTypes.object,
      password: PropTypes.object,
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
    this.props.dispatch(emailSignInFormUpdate(this.getEndpoint(), key, val));
  }

  handleSubmit (event) {
    event.preventDefault();
    let formData = this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "form"]).toJS();
    this.props.dispatch(emailSignIn(formData, this.getEndpoint()))
      .then(this.props.next)
      .catch(() => {});
  }

  render () {
    let disabled = (
      this.props.auth.getIn(["user", "isSignedIn"]) ||
      this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "loading"])
    );

    return (
      <form className='redux-auth email-sign-in-form login-form right card'
            onSubmit={this.handleSubmit.bind(this)}>
        <div className='login-header card-content'>
          <h2 className='card-title white-text'>Login</h2>
        </div>
        <div className='login-field'>
          <div>
            <MaskedInput 
                   mask="111.111.111-11"
                   placeholder='CPF'
                   type="text"
                   className="email-sign-in-email"
                   label="CPF"
                   disabled={disabled}
                   value={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "form", "cpf"])}
                   errors={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "errors", "cpf"])}
                   onChange={this.handleInput.bind(this, "cpf")}
                   {...this.props.inputProps.cpf} />
          </div>
          <div>
            <Input 
                   type="password"
                   placeholder="Senha"
                   className="email-sign-in-password"
                   disabled={disabled}
                   value={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "form", "password"])}
                   errors={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "errors", "password"])}
                   onChange={this.handleInput.bind(this, "password")}
                   {...this.props.inputProps.password} />
          </div>
          <div>
            <ButtonLoader loading={this.props.auth.getIn(["emailSignIn", "loading"])}
                          type="submit"
                          style={{float: "right"}}
                          disabled={disabled}
                          onClick={this.handleSubmit.bind(this)}
                          primary={true}
                          {...this.props.inputProps.submit}>
                Entrar
            </ButtonLoader>
          </div>
        </div>
        <div className='card-action'>
          <a className='right btn-flat waves-effect right login-signup light-green-text text-darken-4'> Cadastre-se </a>
          <a className='btn-flat waves-effect login-iforgot light-green-text text-darken-4'> Esqueceu sua senha?</a>
        </div>
      </form>
    );
  }
}

export default connect(({auth}) => ({auth}))(EmailSignInForm);
