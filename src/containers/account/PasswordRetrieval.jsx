import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { port, apiHost, apiPort, apiVer, webpackHost } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import MaskedInput from 'react-maskedinput';
import { Button, Card, Row, Col, Dropdown, Input, CardPanel } from 'react-materialize'

export class PasswordRetrieval extends React.Component {

  constructor(props) {
     super(props)
     this.state = {
         cpf: '',
         cpf_valid: false,
         request_successful: false
     };

     this.handleSubmit = this.handleSubmit.bind(this);
   }

  prev() {
    browserHistory.push(`/`)
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
      "cpf":  this.state.cpf.replace(/(\.|-)/g,''),
      "redirect_url": "http://" + webpackHost + ":" + port + "/" + "new_password"
    }
    return body;
  }


  handleSubmit() {
    let errors = []

    console
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `auth/password`;
    const fetch_body = this.generateBody();
    fetch(`${apiUrl}/${collection}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
      method: 'post',
      body: JSON.stringify(fetch_body)
    }).then(parseResponse).then(resp => {
      $("#toast-container").remove();
      this.setState({request_successful: true});
      Materialize.toast(resp.message, 10000, "green",function(){$("#toast-container").remove()});
    }).catch(({errors}) => {
      console.log(errors);
      $("#toast-container").remove();
      let full_error_msg = "Ocorreu um erro.\nTem certeza que seu CPF está correto?";
      if(errors !== null){
        //something
      }

      Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});

    });
  }


  confirmButton() {
    return (
      <div className="card-action">
        <a className='back-bt waves-effect btn-flat'
           href='#'
           onClick={this.prev}
        >
          Voltar
        </a>
        <button className="waves-effect btn right button-color"
                href='#'
                onClick={this.handleSubmit}
                disabled={this.state.request_successful}
                name="commit"
                type="submit">
                  Verificar CPF
        </button>
      </div>
    )
  }


  render() {
    return(
      <main>
          <Row>
            <div className='card'>
              <div className='card-content'>
                <Row className='first-line'>
                  <Col>
                    <h2 className='card-title'>Digite seu CPF:</h2>
                    <MaskedInput
                      type="text"
                      className='input-field'
                      mask="111.111.111-11"
                      name="cpf"
                      value={this.state.cpf}
                      onChange={this.handleInputUserChange.bind(this)}
                      />
                      {this.confirmButton()}
                    </Col>
                </Row>
              </div>
            </div>
          </Row>
      </main>
    )
  }
}

export default PasswordRetrieval;
