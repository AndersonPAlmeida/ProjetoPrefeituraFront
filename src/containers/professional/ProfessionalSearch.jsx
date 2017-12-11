import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import MaskedInput from 'react-maskedinput';

class getProfessionalCheck extends Component {

 constructor(props) {
    super(props)
    this.state = {
        cpf: '',
    };
  }

  handleInputUserChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  }

  handleSubmit() {
    let cpf = this.state.cpf.replace(/(\.|-)/g,'');
    let errors = []
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `check_create_professional`;
    const params = `permission=${this.props.user.current_role}&cpf=${cpf}`; 
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
      method: 'get',
    }).then(parseResponse).then(resp => {
      browserHistory.push(`professionals/new?professional_only=true&cpf=${cpf}`)
    }).catch(({errors}) => {
      if(errors && errors.length > 0) {
        let full_error_msg = "";
        errors.forEach(function(elem){ full_error_msg += elem + '\n' });
        Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
      }
      browserHistory.push(`professionals/new?professional_only=false`)
    });
  }

  confirmButton() {
    return (
      <div className="card-action">
        <a className='back-bt waves-effect btn-flat' 
           href='#' 
           onClick={ (e) => { 
             e.preventDefault()
             browserHistory.push(`professionals`) 
           } 
        }> 
          Voltar 
        </a>
        <button className="waves-effect btn right button-color" onClick={this.handleSubmit.bind(this)} name="commit" type="submit">Verificar CPF</button>
      </div>
    )
  }

  render() {
    return (
      <main>
        <Row>
          <Col>
            <h6>CPF:</h6>
            <label>
              <MaskedInput
                type="text"
                className='input-field'
                mask="111.111.111-11"
                name="cpf"
                value={this.state.cpf}
                onChange={this.handleInputUserChange.bind(this)}
              />
            </label>
            {this.confirmButton()}
          </Col>
        </Row>
      </main>
    )
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  return {
    user
  }
}
const ProfessionalCheck = connect(
  mapStateToProps
)(getProfessionalCheck)
export default ProfessionalCheck
