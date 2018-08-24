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
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/UserForm.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import { UserImg } from '../images';
import MaskedInput from 'react-maskedinput';
import update from 'react-addons-update';
import personal_info from './personal_info';
import address_info from './address_info';
import contact_info from './contact_info';
import password_info from './password_info';
import professional_info from './professional_info';
import {userSignIn} from '../../actions/user';
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

class getUserForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      user: {
        address_complement: '',
        address_number: '',
        birth_date: '',
        cep: '',
        cpf: '',
        email: '',
        name: '',
        note: '',
        pcd: '',
        phone1: '',
        phone2: '',
        rg: ''
      },
      aux: {
        address: '',
        birth_date: '',
        city_name: '',
        neighborhood: '',
        photo: '',
        photo_obj: '',
        photo_has_changed: 0,
        password: "",
        current_password: "",
        password_confirmation: "",
        state_abbreviation: '',
        pcd_value: '',
        phonemask1: "(11) 1111-11111",
        phonemask2: "(11) 1111-11111",
        service_place_id: 0,
        permission_id: 0,
        service_place: {},
        service_places: [],
        occupations: [],
        permissions: []
      },
      professional: {
        active: '',
        registration: '',
        occupation_id: 0,
        roles: []
      }
    };
  }

  componentDidMount() {
    var self = this;
    var is_pcd = false;
    var img;
    if(this.props.is_edit) {
      if(this.props.user_data.pcd) {
        is_pcd = true;
      }
      if(!this.props.photo)
        img = UserImg
      else
        img = this.props.photo
      var year = parseInt(this.props.user_data.birth_date.substring(0,4))
      let day = this.props.user_data.birth_date.slice(8,10);
      let month = this.props.user_data.birth_date.slice(5,7);
      let year = this.props.user_data.birth_date.slice(0,4);
      self.setState({
        professional: this.props.professional_data,
        user: this.props.user_data,
        aux: update(this.state.aux,
        {
          birth_date: {$set: `${day}/${month}/${year}`},
          pcd_value: {$set: is_pcd},
          photo_obj: {$set: img}
        })
      })
      this.updateAddress.bind(this)(this.props.user_data.cep.replace(/(\.|-|_)/g,''))
    }
    else {
      img = UserImg
      self.setState({
        aux: update(this.state.aux, { photo_obj: {$set: img} })
      })
      if(typeof location !== 'undefined' && location.search) {
        var search = location.search.substring(1);
        var query = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
        var cep = ""
        var cpf = query['cpf'] ? query['cpf'] : ""
        if(query['cep']) {
          cep = query['cep']
          this.updateAddress.bind(this)(cep.replace(/(\.|-|_)/g,''))
        }
        self.setState({
          user: update(this.state.user, { cep: {$set: cep}, cpf: {$set: cpf} })
        })
      }
    }
    if(this.props.user_class == `professional`) {
      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
      const collection = `forms/create_professional`
      fetch(`${apiUrl}/${collection}?${this.props.fetch_params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get",
      }).then(parseResponse).then(resp => {
        var professional_roles = []
        if(this.props.is_edit) {
          professional_roles = this.props.roles_data
          for(var i = 0; i < professional_roles.length; i++) {
            if(!(this.belongsToCollection(professional_roles[i].service_place_id,resp.service_places,'id')) ||
               !(this.belongsToCollection(professional_roles[i].role,resp.permissions),'role')) {
              professional_roles.splice(i,1)
            }
          }
        }
        self.setState({
                        professional: update(this.state.professional,
                        {
                          roles: {$set: professional_roles}
                        }),
                        aux: update(this.state.aux,
                        {
                          occupations: {$set: resp.occupations},
                          permissions: {$set: resp.permissions},
                          service_places: {$set: resp.service_places}
                        })
                      })
      });
    }
  }

  belongsToCollection(identifier, collection, collection_id) {
    for(var i = 0; i < collection.length; i++) {
      if(identifier == collection[i][collection_id])
        return true
    }
    return false
  }

  handleInputUserChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value
    if(target.validity.valid) {
      this.setState({
        user: update(this.state.user, { [name]: {$set: value} })
      })
    }
  }

  handleChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      aux: update(this.state.aux, { [name]: {$set: value} })
    })
  }

  handleFile(event) {
    const target = event.target;
    const name = target.name;
    var value = target.files[0];
    var reader = new FileReader();

    const onLoad = function(e) {
      var dataURL = reader.result;
      this.setState({
        aux: update(
          this.state.aux, {
                            [name]: {$set: value.name},
                            photo_obj: {$set: dataURL},
                            photo_has_changed: {$set: 1}
                          }
        )
      })
    };
    reader.onload = onLoad.bind(this)
    reader.readAsDataURL(value)
  }

  selectDate(){
      return (
        <Row s={12} l={3}>
          <InputDate
            name='birth_date'
            value={this.state.aux.birth_date}
            onChange={this.handleChange.bind(this)}
            format='yyyy-mm-dd'
          />
        </Row>

      )
    }

  password_change(){
    return(
      <div>
        <div className='category-title'>
          <p>Senha</p>
        </div>
        <div>
          <a className='waves-effect btn password-button button-color' onClick={this.change_citizen_password.bind(this)}> recuperar senha </a>
        </div>
      </div>
    )
  }

  change_citizen_password(e){
    e.preventDefault();
    browserHistory.push(`/citizens/${this.props.user_data.id}/edit/password`);
  }

  updateAddress(cep) {
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'validate_cep';
    var formData = {};
    formData["cep"] = {};
    formData["cep"]["number"] = cep;
    fetch(`${apiUrl}/${collection}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
      method: "post",
      body: JSON.stringify(formData)
    }).then(parseResponse).then(resp => {
      this.setState(
      { aux: update(this.state.aux,
        {
          address: {$set: resp.address},
          neighborhood: {$set: resp.neighborhood},
          city_name: {$set: resp.city_name},
          state_abbreviation: {$set: resp.state_name}
        })
      });
    }).catch(() => {
      Materialize.toast('CEP inválido.', 10000, "red",function(){$("#toast-container").remove()});
    })
  }

  checkEmptyFields(obj, fields) {
    let errors = []
    for (var i = 0; i < fields.length; i++) {
      if(!obj[fields[i].id])
        errors.push(`Campo ${fields[i].name} é obrigatório`)
    }
    return errors;
  }

  checkErrors(formData, auxData, send_password) {
    console.log(this.state);
    console.log(auxData)

    let errors = []
    let form_mandatory = (!this.props.professional_only) ? [ { id: 'name', name: 'Nome' },{ id: 'address_number', name: 'Número' }] : []
    if(this.props.user_class == `citizen` || this.props.user_class == `professional` ) {
      form_mandatory.push({ id: 'cpf', name: 'CPF' })
      form_mandatory.push({ id: 'cep', name: 'CEP' })
      form_mandatory.push({ id: 'phone1', name: 'Telefone 1' })
    }
    errors = this.checkEmptyFields(formData, form_mandatory)
    if(this.props.user_class == `professional`) {
        if(this.state.professional.occupation_id === 0)
            errors.push('Campo Cargo é obrigatório`')
    }
    if(send_password) {
      if(!auxData['password'])
        errors.push("Campo senha não pode estar vazio.")
      if(!auxData['password_confirmation'])
        errors.push("Campo Confirmação de senha não pode estar vazio.")
      if(auxData['password_confirmation'] != auxData['password'])
        errors.push("A senha de confirmação não corresponde a senha atual.");
    }

    if(!auxData['birth_date'])
      errors.push("Campo Data de Nascimento é obrigatório.");
    if(auxData['birth_date'].length < 8 || !isValidDate(auxData['birth_date'])){
        errors.push('Digite uma data válida');
    }

    return errors;
  }

  generateBody(formData, auxData, send_password) {
    let day = auxData['birth_date'].slice(0,2);
    let month = auxData['birth_date'].slice(3,5);
    let year = auxData['birth_date'].slice(6,10);


    if(!auxData['pcd_value']) {
      formData['pcd'] = ''
    }
    formData['cpf'] = formData['cpf'].replace(/(\.|-)/g,'');
    if(formData['phone1'])
      formData['phone1'] = formData['phone1'].replace(/[()_\-\s]/gi, '');
    if(formData['phone2'])
      formData['phone2'] = formData['phone2'].replace(/[()_\-\s]/gi, '');
    formData['cep'] = formData['cep'].replace(/(\.|-)/g,'');
    formData['rg'] = formData['rg'].replace(/(\.|-)/g,'');
    formData['birth_date'] = `${year}-${month}-${day}`;

    if(this.state.aux.photo_has_changed) {
      var image = {};
      image['content'] = this.state.aux.photo_obj.split(',')[1];
      image['content_type'] = this.state.aux.photo_obj.split(",")[0].split(":")[1].split(";")[0];
      image['filename'] = this.state.aux.photo;;
      formData['image'] = image;
    }

    if(send_password) {
      formData['password'] = auxData['password']
      formData['password_confirmation'] = auxData['password_confirmation']
      if(auxData['current_password'])
        formData['current_password'] = auxData['current_password']
    }

    /* adaptate fetch object info to api request */
    let fetch_body = {}
    if(this.props.user_class == `professional`) {
      var { cpf, ...other } = formData
      if(this.props.professional_only) {
        fetch_body['professional'] = this.state.professional
      }
      else {
        fetch_body['professional'] = Object.assign({},this.state.professional,other)
        fetch_body['professional']['cpf'] = cpf
      }
      fetch_body['cpf'] = cpf
    } else if(this.props.user_class == `dependant`) {
      fetch_body['dependant'] = formData
    } else {
      if(this.props.is_edit) {
        var { password, current_password, password_confirmation, ...other } = formData
        if(password) {
          fetch_body['password'] = password
          fetch_body['current_password'] = current_password
          fetch_body['password_confirmation'] = password_confirmation
        }
        if(this.props.current_professional) {
          fetch_body['registration'] = this.state.professional.registration
          fetch_body['occupation_id'] = this.state.professional.occupation_id
        }
        fetch_body['citizen'] = other
      }
      else
        fetch_body = formData
    }
    return fetch_body
  }

  successMessage() {
    let success_msg = ''
    switch(this.props.user_class) {
      case `dependant`:
        success_msg += 'Dependente'
        break
      case `professional`:
        success_msg += 'Profissional'
        break
      default:
        success_msg += 'Cidadão'
    }

    if(this.props.is_edit)
      success_msg += ' editado com sucesso'
    else
      success_msg += ' criado com sucesso'
    return success_msg
  }

  handleSubmit() {
    let formData = this.state.user;
    let auxData = this.state.aux;
    var send_password = false;
    if((!this.props.professional_only) && this.props.user_class != `dependant` && (!this.props.is_edit || auxData['current_password'])) {
      send_password = true
    }
    let errors = this.checkErrors.bind(this)(formData,auxData,send_password)
    if(errors.length > 0) {
      let full_error_msg = "";
      errors.forEach(function(elem){ full_error_msg += elem + '\n' });
      $("#toast-container").remove();
      Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
    } else {
      let fetch_body = this.generateBody.bind(this)(formData,auxData,send_password)
      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
      const collection = this.props.fetch_collection;
      var params = this.props.fetch_params;
      if(this.props.user_class == `professional` && (!this.props.is_edit))
        params += this.props.professional_only ? "&create_citizen=false" : "&create_citizen=true"
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
        method: this.props.fetch_method,
        body: JSON.stringify(fetch_body)
      }).then(parseResponse).then(resp => {
        if(this.props.is_edit && this.props.user_class == `citizen` && this.props.current_citizen) {
          this.props.dispatch(userSignIn(resp.data))
        }
        $("#toast-container").remove();
        Materialize.toast(this.successMessage.bind(this)(), 10000, "green",function(){$("#toast-container").remove()});
        browserHistory.push(this.props.submit_url)
    }).catch((errors_resp) => {
        if(errors_resp) { // TODO: UPDATE ERRORS ARRAY ACCORDING TO API
          let full_error_msg = "";
          if(errors_resp.errors.length > 0) {
            let full_error_msg = "";
            $("#toast-container").remove();
            errors_resp.errors.forEach(function(elem){ full_error_msg += elem + '\n' });
            Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
          }
          throw errors;
        }
      });
    }
  }

  confirmButton() {
    return (
      <div className="card-action">
        <a className='back-bt waves-effect btn-flat' href='#' onClick={this.props.prev}> Voltar </a>
        <button className="waves-effect btn right button-color" onClick={this.handleSubmit.bind(this)} name="commit" type="submit">{this.props.is_edit ? "Atualizar" : "Criar"}</button>
      </div>
    )
  }

  password_field() {

      if(this.props.user_class != 'dependant'){
        if(this.props.fetch_collection === 'auth'){
          return password_info.bind(this)()
        }else{
          return this.password_change.bind(this)()
        }
      }
      else{
        return null;
      }
  }

  render() {
    var title = this.props.is_edit ? 'Editar ' : 'Cadastrar ';
    switch (this.props.user_class) {
      case `citizen`:
        title += 'Cidadão'
        break
      case `dependant`:
        title += 'Dependente'
        break
      default:
        title += 'Profissional'
    }
    if(this.props.is_edit)
      title += `: ${this.props.user_data.name}`
    return (
      <main>
        <Row>
          <Col s={12}>
            <div className='card'>
              <div className='card-content'>
                <h2 className="card-title">{title}</h2>
                {
                  !this.props.professional_only ?
                    <div>
                      <Row s={12}></Row>
                      <Row s={12}>
                        <Col s={12} m={6}>
                          {personal_info.bind(this)()}
                        </Col>
                        <Col s={12} m={6}>
                          {address_info.bind(this)()}
                        </Col>
                      </Row>
                      <Row s={12}>
                        <Col s={12} m={6}>
                          {contact_info.bind(this)()}
                        </Col>
                        <Col s={12} m={6}>
                          {
                            this.props.user_class != `dependant` ?
                              password_info.bind(this)() :
                              null
                          }

                        </Col>
                      </Row>
                    </div>
                    : null
                }
                {
                  (this.props.user_class == `professional` || this.props.current_professional) ?
                    <Row s={12}>
                      <Col s={12} m={6}>
                        {professional_info.bind(this)()}
                      </Col>
                    </Row>
                    : null
                }
                <p><font color="red"> Campos com (*) são de preenchimento obrigatório.</font></p>
                {this.confirmButton()}
              </div>
            </div>
          </Col>
        </Row>
      </main>
    )
  }
}

const UserForm = connect()(getUserForm)
export default UserForm
