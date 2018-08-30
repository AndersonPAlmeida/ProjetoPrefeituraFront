import React, {Component} from 'react'
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { port, apiHost, apiPort, apiVer, webpackHost } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import MaskedInput from 'react-maskedinput';
import { Button, Row, Col, Input, Card } from 'react-materialize'
import styles from './styles/PasswordChange.css'

class PasswordChange extends Component {

  constructor(props) {
     super(props)
     this.state = {
         password: '',
         password_confirm: ''
     };

     this.handleSubmit = this.handleSubmit.bind(this);
   }

  prev() {
    browserHistory.push(`/`);
  }

  handleInputUserChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  }

  generateBody(){
    let body = {
      "password": this.state.password
    }
    return body;
  }

  handleSubmit() {
    if(this.state.password !== this.state.password_confirm){
      Materialize.toast("A confirmação deve ser igual a senha",
      10000, "red",function(){$("#toast-container").remove()});
      return;
    }
    let errors = []
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `auth`;
    const fetch_body = this.generateBody();
    fetch(`${apiUrl}/${collection}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
      method: 'put',
      body: JSON.stringify(fetch_body)
    }).then(parseResponse).then(resp => {
      $("#toast-container").remove();
      Materialize.toast("Sua senha foi atualizada com sucesso!", 10000, "green",function(){$("#toast-container").remove()});
      this.prev();
    }).catch(({errors}) => {
      if(errors && errors.length > 0) {
        $("#toast-container").remove();
        let full_error_msg = "Ocorreu um erro ao tentar atualizar sua senha.\nTente novamente mais tarde.";
        Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});

      }
    });

  }


  confirmButton() {
    return (
      <div className="card-action">
        <button className="waves-effect btn right button-color"
                href='#'
                onClick={this.handleSubmit}
                name="commit"
                type="submit">
                  Atualizar Senha
        </button>
      </div>
    )
  }


  render() {
    return(
      <main>
          <Row>
            <Card title="Definir nova senha">
                <Row className='full-width'>
                  <Col s={12}>
                    <Input
                      label='Nova senha'
                      type="password"
                      name="password"
                      labelClassName='new-password'
                      value={this.state.password}
                      onChange={this.handleInputUserChange.bind(this)}
                      />

                    </Col>

                    <Col s={12}>

                      <Input
                        label='Confirmar senha'
                        labelClassName='new-password'
                        type="password"
                        name="password_confirm"
                        value={this.state.password_confirm}
                        onChange={this.handleInputUserChange.bind(this)}
                        />

                    </Col>

                </Row>

                <Row>
                  {this.confirmButton()}
                </Row>
          </Card>
        </Row>
      </main>
    )
  }
}

export default connect(({ routes }) => ({ routes }))(PasswordChange);
