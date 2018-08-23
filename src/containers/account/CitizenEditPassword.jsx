{/*
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
  */}

import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Row, Col, Input } from 'react-materialize'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import MaskedInput from 'react-maskedinput';
import update from 'react-addons-update';
import styles from './styles/CitizenEditPassword.css'
import { InputDate } from '../components/AgendadorComponents'

function isValidDate(s) {
  var bits = s.split('/');
  var y = bits[2],
    m = bits[1],
    d = bits[0];
  // Assume not leap year by default (note zero index for Jan)
  var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // If evenly divisible by 4 and not evenly divisible by 100,
  // or is evenly divisible by 400, then a leap year
  if ((!(y % 4) && y % 100) || !(y % 400)) {
    daysInMonth[1] = 29;
  }
  return !(/\D/.test(String(d))) && d > 0 && d <= daysInMonth[--m]
}

class getCitizendEditPassword extends Component{
  constructor(props) {
     super(props)
     this.state = {
      password: '',
      password_confirmation: '',
      cpf:'',
      date:''
     };
     this.handleInputUserChange.bind(this);
   }

   prev(e){
     e.preventDefault();
     browserHistory.push(`professionals/users/${this.props.routeParams.id}/edit`);
   }

   generateBody(){
     let fetch_body = {};
     let dateString = this.state.date;
     let day = dateString.slice(0,2);
     let month = dateString.slice(3,5);
     let year = dateString.slice(6,10);

     fetch_body['password'] = this.state.password;
     fetch_body['password_confirmation'] = this.state.password_confirmation;
     fetch_body['cpf'] = this.state.cpf.replace(/(\.|-)/g,'');
     fetch_body['birth_date'] = `${year}-${month}-${day}`;

     return fetch_body;
   }

   checkErrors(){
     let errors = []

     let dateString = this.state.date;

     if(this.state.cpf == null || this.state.cpf.replace(/(\.|-)/g,'').length < 11)
      errors.push("CPF é obrigatório.");

     if(dateString == null || dateString.length < 10 || !isValidDate(dateString)){
       errors.push('Digite uma data válida');
     }


     if(!this.state.password)
      errors.push("Campo senha não pode estar vazio.");

     if(this.state.password.length < 6)
      errors.push("A senha deve ter pelo menos 6 caracteres.");

     if(!this.state.password_confirmation)
      errors.push("Campo confirmação de senha não pode estar vazio.");

     if(this.state.password_confirmation !== this.state.password)
      errors.push("As senhas não são iguais.");

     return errors;
   }

   handleSubmit(){
    let errors = this.checkErrors.bind(this)();

    if(errors.length > 0) {
      let full_error_msg = "";
      errors.forEach(function(elem){ full_error_msg += elem + '\n' });
      $("#toast-container").remove();
      Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});

    } else {
      let fetch_body = this.generateBody.bind(this)()
      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
      const collection = `citizens/${this.props.routeParams.id}/change_password`;
      var params = `permission=${this.props.user.current_role}`;
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
        method: 'put',
        body: JSON.stringify(fetch_body)
      }).then(parseResponse).then(resp => {
        $("#toast-container").remove();
        Materialize.toast("Senha alterada com sucesso", 10000, "green",function(){$("#toast-container").remove()});
        browserHistory.push(`professionals/users/${this.props.routeParams.id}/edit`);
      }).catch(({errors}) => { // TODO: UPDATE ERRORS ARRAY ACCORDING TO API
        if(errors) {
          let full_error_msg = "";
          errors.forEach(function(elem){ full_error_msg += elem + '\n' });
          Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
          throw errors;
        }
      });

     }
   }

   handleInputUserChange(event) {
     const target = event.target;
     const value = target.value;
     const name = target.name;

     if(target.validity.valid) {
       this.setState({
         [name]: value
       })
    }
   }

   render(){
     return(
       <main>
         <Row>
           <Col s={12}>
             <div className='card'>
               <div className='card-content'>
                 <h2 className="card-title">Recuperar Senha</h2>
                 <Row>
                   <Col>
                     <MaskedInput className='citizen-edit-password'
                       mask="111.111.111-11"
                       placeholder='CPF'
                       name='cpf'
                       value={this.state.cpf}
                       onChange={
                         (event) => {
                           this.handleInputUserChange(event)
                         }}/>
                   </Col>
                 </Row>
                 <Row>
                   <Col>
                     <InputDate
                       name='date'
                       className='citizen-edit-password'
                       value={this.state.date}
                       onChange={
                         (event) => {
                           this.handleInputUserChange(event)
                         }}/>

                   </Col>
                 </Row>
                 <Row>
                    <Input name='password' type='password'
                      onChange={(event) => {
                        this.handleInputUserChange(event)
                      }}
                      className='citizen-edit-password' value={this.state.password}
                      labelClassName='citizen-edit-password' label='Senha'/>
                 </Row>
                 <Row>
                    <Input name='password_confirmation'type='password'
                      onChange={(event) => {
                        this.handleInputUserChange(event)
                      }}
                      className='citizen-edit-password' value={this.state.password_confirmation}
                      labelClassName='citizen-edit-password' label='Confirmação da Senha'/>
                 </Row>
                 <p className="red-text">Todos os campos são de preenchimento obrigatório.</p>
                </div>
                <div className='card-action'>
                  <a className='back-bt waves-effect btn-flat' href='#' onClick={this.prev.bind(this)}> Voltar </a>
                  <Button className="waves-effect btn right button-color" onClick={this.handleSubmit.bind(this)} name="commit" type="submit">Atualizar</Button>
                </div>
              </div>
            </Col>
          </Row>
       </main>
      )
   }

}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  let is_professional = (user.roles && user.roles.length > 0)
  return {
    user,
    is_professional
  }
}

const CitizendEditPassword = connect(
  mapStateToProps
)(getCitizendEditPassword)
export default CitizendEditPassword
