import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ServicePlaceForm.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import MaskedInput from 'react-maskedinput';
import update from 'react-addons-update';

class getServicePlaceForm extends Component {

 constructor(props) {
    super(props)
    this.state = {
      service_place: { 
        address_complement: '',
        address_number: '',
        active: true,
        name: '',
        cep: '',
        email: '',
        url: '',
        phone1: '',
        phone2: '',
        city_hall_id: '',
        service_types: []
      },
      aux: {
        address: '',
        city_name: '',
        neighborhood: '',
        password_confirmation: "",
        state_abbreviation: '',
        city_hall: {
          name: '',
          service_types: []
        }
      },
      update_checkbox: 0,
      phonemask: "(11) 1111-11111",
    };
  }

  componentDidMount() {
    var self = this;
    if(this.props.is_edit) {
      self.setState({ service_place: this.props.data })
      if(this.props.data.cep) {
        this.updateAddress.bind(this)(this.props.data.cep.replace(/(\.|-|_)/g,''))
      }
    }
  }

  componentDidUpdate() {
    /* check true for all service types that belongs to the service place */
    if(this.state.update_checkbox) {
      this.state.aux.city_hall.service_types.map((service_type, idx) => {
        for(var i = 0; i < this.state.service_place.service_types.length; i++) {
          if (this.state.service_place.service_types[i].id == service_type.id) {
            service_type['checked'] = true
            this.setState({
              aux: update(this.state.aux, {city_hall: {service_types: {$splice: [[idx,1,service_type]] } } })
            })
            break;
          }
        }
      })
      this.setState({ update_checkbox: 0 })
    }
  }

  handleInputServicePlaceChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name

    if(target.validity.valid) {
      this.setState({
        service_place: update(this.state.service_place, { [name]: {$set: value} })
      })
    }
  }

  handleCheckboxChange(event) {
    const target = event.target;
    const value = target.id;
    const check = this.state.aux.city_hall.service_types[value].checked ? false : true

    this.setState({
      aux: update(this.state.aux, {city_hall: {service_types: {[value]: {checked: {$set: check} } } } })
    })
  }

  updateAddress(cep) {
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'forms/create_service_place';
    const params = `${this.props.fetch_params}&cep=${cep}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
      method: "get"
    }).then(parseResponse).then(resp => {
      if(resp.city_halls.length > 0) {

        resp.city_halls[0].service_types.map((service_type) => {
          service_type['checked'] = false
        })
        this.setState(
        { 
          update_checkbox: 1,
          service_place: update(this.state.service_place,
          {
            city_hall_id: {$set: resp.city_halls[0].id}
          }),
          aux: update(this.state.aux,
          {
            address: {$set: resp.address},
            neighborhood: {$set: resp.neighborhood},
            city_name: {$set: resp.city_name},
            state_abbreviation: {$set: resp.state_name},
            city_hall: {$set: resp.city_halls[0]}
          })
        });
      }
      else
        Materialize.toast('Você não tem permissão para criar local de atendimento nesta prefeitura.', 10000, "red",function(){$("#toast-container").remove()});
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

  checkErrors(formData) {
    let errors = []
    let form_mandatory =
      [
        { id: 'name', name: 'Nome' },
        { id: 'cep', name: 'CEP' },
        { id: 'address_number', name: 'Número' }
      ]
    errors = this.checkEmptyFields(formData, form_mandatory)
    return errors;
  }

  generateBody(formData) {
    if(formData['phone1'])
      formData['phone1'] = formData['phone1'].replace(/[()_\-\s]/gi, '');
    if(formData['phone2'])
      formData['phone2'] = formData['phone2'].replace(/[()_\-\s]/gi, '');
    formData['cep'] = formData['cep'].replace(/(\.|-)/g,'');
    let service_types = [];
    this.state.aux.city_hall.service_types.map((service_type) => {
      if(service_type.checked)
        service_types.push(service_type.id)
    })
    formData['service_types'] = service_types
    let fetch_body = {}
    fetch_body['service_place'] = formData
    return fetch_body
  }

  handleSubmit() {
    let formData = this.state.service_place;
    let errors = this.checkErrors.bind(this)(formData);
    if(errors.length > 0) {
      let full_error_msg = "";
      errors.forEach(function(elem){ full_error_msg += elem + '\n' });
      Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
    } else {
      let fetch_body = this.generateBody.bind(this)(formData)
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = this.props.fetch_collection;
      const params = this.props.fetch_params; 
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
        method: this.props.fetch_method,
        body: JSON.stringify(fetch_body)
      }).then(parseResponse).then(resp => {
        if(this.props.is_edit)
          Materialize.toast('Setor editado com sucesso.', 10000, "green",function(){$("#toast-container").remove()});
        else
          Materialize.toast('Setor criado com sucesso.', 10000, "green",function(){$("#toast-container").remove()});
        browserHistory.push(this.props.submit_url)
      }).catch(({errors}) => { // TODO: UPDATE ERRORS ARRAY ACCORDING TO API
        if(errors) {
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

  pickServiceTypes() {
    if(!this.state.aux.city_hall.service_types)
      return ( <div /> )

    const serviceTypeList = (
      this.state.aux.city_hall.service_types.map((service_type, idx) => {
        return(
          <div>
            <input type="checkbox" checked={service_type.checked} id={idx} /><label id={idx} for={idx} onClick={this.handleCheckboxChange.bind(this)}>{service_type.description}</label>
          </div>
        )
      })
    )
    return (
      <div>
        <h6>Escolha os tipos de atendimento:</h6>
        <div>
          {serviceTypeList}
          <br />
        </div>
      </div>
    )
  }

  render() {
    return (
      <main>
      	<Row s={12}>
          <div className='card'>
            <div className='card-content'>
              <Row></Row>
              <Row s={12}>
                {this.props.is_edit ?
                  <h2 className="card-title">Alterar local de atendimento {this.props.data.name}</h2> 
                  :
                  <h2 className="card-title">Cadastrar local de atendimento</h2> 
                }
              </Row>
              <Row s={12}>
                <Col s={12} m={6}>
                  <Row></Row>
                  <Row s={6}>
                  <h6>Situação*:</h6>
                    <div>
                      <Input s={6} m={32} l={6} 
                             type='select'
                             name='active'
                             value={this.state.service_place.active}
                             onChange={this.handleInputServicePlaceChange.bind(this)} 
                      >
                        <option key={0} value={true}>Ativo</option>
                        <option key={1} value={false}>Inativo</option>
                      </Input>
                    </div>
                  </Row>

                  <Row s={6}>
                    <h6>Nome*:</h6>
                    <label>
                      <input 
                        type="text" 
                        name="name" 
                        value={this.state.service_place.name} 
                        onChange={this.handleInputServicePlaceChange.bind(this)} 
                      />
                    </label>
                  </Row>

                  <Row s={6}>
                    <h6>CEP*:</h6>
                    <label>
                      <MaskedInput
                        type="text"
                        mask="11111-111" name="cep"
                        value={this.state.service_place.cep}
                        onChange=
                        {
                          (event) => {
                            this.handleInputServicePlaceChange.bind(this)(event)
                            var cep = event.target.value.replace(/(\.|-|_)/g,'')
                            if(cep.length == 8)
                              this.updateAddress.bind(this)(cep)
                          }
                        }
                      />
                    </label>
                  </Row>

                  <Row s={6}>
                    <h6>Prefeitura*:</h6>
                    <label>
                      <input
                        type="text"
                        name="city_hall_name"
                        value={this.state.aux.city_hall.name}
                        disabled />
                    </label>
                  </Row>

                  <Row s={6}>
                    <h6>Estado do endereço*:</h6>
                    <label>
                      <input
                        type="text"
                        name="state_abbreviation"
                        value={this.state.aux.state_abbreviation}
                        disabled />
                    </label>
                  </Row>

                  <Row s={6}>
                    <h6>Munícipio*:</h6>
                    <label>
                      <input
                        type="text"
                        name="city"
                        value={this.state.aux.city_name}
                        disabled
                      />
                    </label>
                  </Row>

                  <Row s={6}>
                    <h6>Bairro*:</h6>
                    <label>
                      <input
                        type="text"
                        className='input-field'
                        name="neighborhood"
                        value={this.state.aux.neighborhood}
                      />
                    </label>
                  </Row>

                  <Row s={6}>
                    <h6>Número*:</h6>
                    <label>
                      <input
                        type="text"
                        className='input-field'
                        name="address_number"
                        pattern="[0-9]*"
                        value={this.state.service_place.address_number}
                        onChange={this.handleInputServicePlaceChange.bind(this)}
                      />
                    </label>
                  </Row>

                  <Row s={6}>
                    <h6>Complemento:</h6>
                    <label>
                      <input
                        type="text"
                        className='input-field'
                        name="address_complement"
                        value={this.state.service_place.address_complement}
                        onChange={this.handleInputServicePlaceChange.bind(this)} />
                    </label>
                  </Row>
                </Col>

                <Col s={12} m={6}>
                  <Row></Row>

                  <Row s={6}>
                    {this.pickServiceTypes()}
                  </Row>

                  <Row s={6}>
                    <h6>Telefone 1:</h6>
                    <label>
                      <MaskedInput
                        mask={this.state.phonemask}
                        type="text"
                        name="phone1"
                        value={this.state.service_place.phone1}
                        onChange={
                          (event) => {
                            this.handleInputServicePlaceChange.bind(this)(event)
                            if(event.target.value.replace(/(_|-|(|))/g,'').length == 13)
                              this.setState({phonemask: "(11) 11111-1111"})
                            else
                              this.setState({phonemask: "(11) 1111-11111"})
                          }
                        }
                      />
                    </label>
                  </Row>

                  <Row s={6}>
                    <h6>Telefone 2:</h6>
                    <label>
                      <MaskedInput
                        mask={this.state.phonemask}
                        type="text"
                        name="phone2"
                        value={this.state.service_place.phone2}
                        onChange={this.handleInputServicePlaceChange.bind(this)}
                      />
                    </label>
                  </Row>

                  <Row s={6}>
                    <h6>E-mail:</h6>
                    <label>
                      <input
                        type="text"
                        name="email"
                        value={this.state.service_place.email}
                        onChange={this.handleInputServicePlaceChange.bind(this)}
                      />
                    </label>
                  </Row>

                  <Row s={6}>
                    <h6>Site:</h6>
                    <label>
                      <input
                        type="text"
                        className='input-field'
                        name="url"
                        value={this.state.service_place.url}
                        onChange={this.handleInputServicePlaceChange.bind(this)}
                      />
                    </label>
                  </Row>

                  <p><font color="red"> Campos com (*) são de preenchimento obrigatório.</font></p>
                </Col>
              </Row>
              {this.confirmButton()}
            </div>
          </div>
        </Row>
      </main>
    )
  }
}

const ServicePlaceForm = connect()(getServicePlaceForm)
export default ServicePlaceForm
