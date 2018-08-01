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
        birth_day: '',
        birth_month: '',
        birth_year: '',
        birth_year_id: '',
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
      self.setState({
        professional: this.props.professional_data,
        user: this.props.user_data,
        aux: update(this.state.aux, 
        {
          birth_day: {$set: parseInt(this.props.user_data.birth_date.substring(8,10))},
          birth_month: {$set: parseInt(this.props.user_data.birth_date.substring(5,7))},
          birth_year: {$set: year},
          birth_year_id: {$set: year-1899},
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
      var optionsDays = []; 
      optionsDays.push(<option key={0} value="" disabled>Dia</option>);
      for(var i = 1; i <= 31; i++){
        optionsDays.push(
          <option key={i} value={i}>{i}</option>
        );
      }
      var optionsMonths = []
      optionsMonths.push(<option key={0} value="" disabled>Mês</option>);
      var months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      for(var i = 0; i < 12; i++){
        optionsMonths.push(
          <option key={i+1} value={i+1}>{months[i]}</option>
        );
      }
      var optionsYears = []
      optionsYears.push(<option key={0} value="" disabled>Ano</option>);
      var year = new Date().getFullYear()
      for(var i = 1900; i < year; i++){
        optionsYears.push(
          <option key={i-1899} value={i-1899}>{i}</option>
        );
      }
      return (
        <div>
          <Input s={12} l={3} 
            type='select'
            name='birth_day'
            value={this.state.aux.birth_day}
            onChange={this.handleChange.bind(this)}
          >
            {optionsDays}
          </Input>

          <Input s={12} l={4} 
            type='select'
            name='birth_month'
            value={this.state.aux.birth_month}
            onChange={this.handleChange.bind(this)}
          >
            {optionsMonths}
          </Input>

          <Input s={12} l={4} 
            type='select'
            name='birth_year_id'
            value={this.state.aux.birth_year_id}
            onChange={ (event) => {
                this.handleChange.bind(this)(event) 
                this.setState({aux: update(this.state.aux, 
                  {
                    birth_year: {$set: parseInt(this.state.aux.birth_year_id)+parseInt(1899)},
                  })
                })
              }
            }
          >
            {optionsYears}
          </Input>
        </div>
      )
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
    let errors = []
    let form_mandatory = (!this.props.professional_only) ? [ { id: 'name', name: 'Nome' } ] : []
    if(this.props.user_class == `citizen`) {
      form_mandatory.push({ id: 'cpf', name: 'CPF' })
      form_mandatory.push({ id: 'cep', name: 'CEP' })
      form_mandatory.push({ id: 'phone1', name: 'Telefone 1' })
    }
    errors = this.checkEmptyFields(formData, form_mandatory)
    if(send_password) {
      if(!auxData['password'])
        errors.push("Campo senha não pode estar vazio.")
      if(!auxData['password_confirmation'])
        errors.push("Campo Confirmação de senha não pode estar vazio.")
      if(auxData['password_confirmation'] != auxData['password'])
        errors.push("A senha de confirmação não corresponde a senha atual.");
    }
    if(!this.props.professional_only)
      if(!auxData['birth_day'] || !auxData['birth_month'] || !auxData['birth_year'])
        errors.push("Campo Data de Nascimento é obrigatório.");
    return errors;
  }

  generateBody(formData, auxData, send_password) {
    const monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", 
      "Oct", "Nov", "Dec"
    ];
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
    formData['birth_date'] = `${monthNames[auxData['birth_month']-1]} ${auxData['birth_day']} ${auxData['birth_year']}`

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
        Materialize.toast(this.successMessage.bind(this)(), 10000, "green",function(){$("#toast-container").remove()});
        browserHistory.push(this.props.submit_url)
      }).catch((errors) => {
        if(errors && errors['full_messages']) { // TODO: UPDATE ERRORS ARRAY ACCORDING TO API
          let full_error_msg = "";
          errors['full_messages'].forEach(function(elem){ full_error_msg += elem + '\n' });
          Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
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
