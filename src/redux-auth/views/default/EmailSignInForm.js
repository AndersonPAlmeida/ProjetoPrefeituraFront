/*
 * This file is part of Agendador.
 *
 * Agendador is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Agendador is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Agendador.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from "react";
import PropTypes from 'prop-types';
import ButtonLoader from "./ButtonLoader";
import Input from "./Input";
import { emailSignInFormUpdate, emailSignIn } from "../../actions/email-sign-in";
import styles from "../../../containers/account/styles/SignIn.css";
import { connect } from "react-redux";

class EmailSignInForm extends React.Component {
  static propTypes = {
    endpoint: PropTypes.string,
    next: PropTypes.func,
    signup: PropTypes.func,
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
    formData['cpf'] = formData['cpf'].replace(/(\.|-)/g,'');
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
            <Input type="text"
                   mask="111.111.111-11"
                   className="email-sign-in-email"
                   label="CPF"
                   placeholder="CPF"
                   disabled={disabled}
                   value={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "form", "cpf"])}
                   errors={this.props.auth.getIn(["emailSignIn", this.getEndpoint(), "errors", "cpf"])}
                   onChange={this.handleInput.bind(this, "cpf")}
                   {...this.props.inputProps.cpf} />
          </div>
          <div>
            <Input type="password"
                   label="Senha"
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
          <a className='right btn-flat waves-effect right login-signup light-green-text text-darken-4' onClick={() => this.props.signup()} > Cadastre-se </a>
          <a className='btn-flat waves-effect login-iforgot light-green-text text-darken-4' onClick={() => this.props.newPassword()}> Esqueceu sua senha?</a>
        </div>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.get('auth') }
}

export default connect(mapStateToProps)(EmailSignInForm)
