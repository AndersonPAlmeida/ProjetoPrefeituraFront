import React from "react";
import PropTypes from 'prop-types';
import Input from "./Input";
import ButtonLoader from "./ButtonLoader";
import { Row, Col, Card, Button, Input as _Input } from 'react-materialize';
import { emailSignUpFormUpdate, signUpCEP } from "../../actions/email-sign-up";
import { connect } from "react-redux";
import styles from '../../../containers/styles/SignUpForm.css'
import UserImg from '../../../../public/user.png'
import Home from '../../../containers/Home';

class SignUpCEP extends React.Component {
  static propTypes = {
    endpoint: PropTypes.string,
    next: PropTypes.func,
    prev: PropTypes.func,
    icon: PropTypes.string,
    inputProps: PropTypes.shape({
      submit: PropTypes.object
    })
  };

  constructor(props) {
        super(props);
        this.state = { 
          check: false,
        };
        this.handleChange = this.handleChange.bind(this);
  }

  static defaultProps = {
    next: () => {},
    inputProps: {
      cpf: {},
      password: {},
      submit: {}
    }
  };

  handleChange(event){
    this.setState({check: event.target.value})
  }

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
    event.preventDefault();
    var formData = {};
    formData["cep"] = {};
    formData["cep"]["number"] = this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form"]).toJS().cep;
    formData["cep"]["number"] = formData["cep"]["number"].replace(/(\.|-)/g,'');
    this.props.dispatch(signUpCEP(formData, this.getEndpoint(), this.props.next)).catch(() => {});
    this.handleInput("address_street","123");
  }

  render () {
    return (
      <div className='card'>
        <form className='redux-auth email-sign-up-form'
              style={{clear: "both", overflow: "hidden"}}
              onSubmit={this.handleSubmit.bind(this)}>
          <div className='card-content'>
            <h2 className='card-title'>Digite seu CEP</h2>
            <p>Para podermos verificar a disponibilidade do agendador na sua cidade, informe seu CEP.</p>
            <Input name='cep'
                   mask="11111-111"
                   label="CEP:*"
                   placeholder="CEP"
                   value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "cep"])}
                   errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "cep"])}
                   onChange={this.handleInput.bind(this, "cep")} />
          </div>
          <div className='card-action'>
            <ButtonLoader type="submit"
                          className="email-sign-up-submit btn waves-effect right"
                          primary={true}
                          style={{float: "right"}}
                          icon={this.props.icon}
                          onClick={this.handleSubmit.bind(this)}
                          {...this.props.inputProps.submit}>
              Criar Conta
            </ButtonLoader>
            <a className='back-bt waves-effect btn-flat' onClick={() => this.props.prev()} > Voltar </a>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(({auth}) => ({auth}))(SignUpCEP);
