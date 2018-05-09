import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import styles from "./styles/SignUp.css"
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import MaskedInput from 'react-maskedinput';

class SignUpCep extends Component {

 constructor(props) {
    super(props)
    this.state = {
        cep: '',
    };
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  }

  handleSubmit() {
    var formData = {};
    formData["cep"] = {};
    formData["cep"]["number"] = this.state.cep.replace(/(\.|-)/g,'');
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'validate_cep';
    fetch(`${apiUrl}/${collection}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
      method: 'post',
      body: JSON.stringify(formData)
    }).then(parseResponse).then(resp => {
      browserHistory.push({ pathname: '/signup2', query: {cep: formData["cep"]["number"]} })
    }).catch(({errors}) => {
      Materialize.toast("CEP Invalido", 10000, "red",function(){$("#toast-container").remove()});
    });
  }

  prev(e) {
    e.preventDefault()
    browserHistory.push("/")
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
                onClick={ (e) => {
                  this.handleSubmit.bind(this)(e)
                }} 
                name="commit" 
                type="submit">
                  Verificar CEP
        </button>
      </div>
    )
  }

  render() {
    return (
      <main>
        <Row>
          <Col offset={'s5'}>
            <h6>CEP:</h6>
            <label>
              <MaskedInput
                type="text"
                mask="11111-111"
                name="cep"
                value={this.state.cep}
                onChange={this.handleInputChange.bind(this)}
              />
            </label>
            {this.confirmButton()}
          </Col>
        </Row>
      </main>
    )
  }
}

export default connect(({ routes }) => ({ routes }))(SignUpCep);
