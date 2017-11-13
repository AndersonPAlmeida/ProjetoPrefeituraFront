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
import { ServicePlaceImg } from '../images';
import MaskedInput from 'react-maskedinput';
import update from 'react-addons-update';

class getServicePlaceForm extends Component {

 constructor(props) {
    super(props)
    this.state = {
      service_place: { 
        address_complement: '',
        address_number: '',
        active: '',
        name: '',
        cep: '',
        email: '',
        url: '',
        phone1: '',
        phone2: '',
        city_hall_id: 0
      },
      aux: {
        address: '',
        city_name: '',
        neighborhood: '',
        password_confirmation: "",
        state_abbreviation: ''
      },
      phonemask: "(11) 1111-11111",
      city_halls: []
    };
  }

  componentWillMount() {
    var self = this;
    if(this.props.is_edit) {
      self.setState({ service_place: this.props.data })
      if(this.props.data.cep)
        this.updateAddress.bind(this)(this.props.data.cep.replace(/(\.|-|_)/g,''))
    }
    if(this.props.current_role.role != 'adm_c3sl') {
      this.setState({
        service_place: update(this.state.service_place, { ['city_hall_id']: {$set: this.props.current_role.city_hall_id} })
      })
    }
    else {
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = 'forms/service_type_index';
      const params = this.props.fetch_params;
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get",
      }).then(parseResponse).then(resp => {
        self.setState({ city_halls: resp.city_halls })
      });
    }
  }

  handleInputServicePlaceChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      service_place: update(this.state.service_place, { [name]: {$set: value} })
    })
  }

  updateAddress(cep) {
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
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

  handleSubmit() {
    let errors = [];
    let formData = {};
    formData = this.state.service_place;
    if(!formData['name'])
      errors.push("Campo Nome é obrigatório.");
    if(errors.length > 0) {
      let full_error_msg = "";
      errors.forEach(function(elem){ full_error_msg += elem + '\n' });
      Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
    } else {
      formData['phone1'] = formData['phone1'].replace(/_/g,'');
      formData['phone2'] = formData['phone2'].replace(/_/g,'');
      formData['cep'] = formData['cep'].replace(/(\.|-)/g,'');
      let fetch_body = {}
      if(this.props.is_edit) {
        fetch_body['service_place'] = formData
      }
      else {
        formData['city_hall_id'] = this.props.city_hall_id
        fetch_body = formData
      }
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
      }).catch(({errors}) => {
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

  pickCityHall() {
    if(this.props.current_role.role != 'adm_c3sl') {
      return (
        <Input disabled
               name="selected_city_hall"
               type='select'
               value={this.props.current_role.city_hall_id}
        >
          <option value={this.props.current_role.city_hall_id}>{this.props.current_role.city_hall_name}</option>
        </Input>
      )
    }

    const cityHallsList = (
      this.state.city_halls.map((city_hall) => {
        return (
          <option value={city_hall.id}>{city_hall.name}</option>
        )
      })
    )
    return (
      <Input
        name="city_hall_id"
        type='select'
        value={this.state.service_place.city_hall_id}
        onChange={
          (event) => {
            if(event.target.value != this.state.selected_city_hall) {
                this.handleInputServicePlaceChange(event);
            }
          }
        }
      >
        <option value='0' disabled>Escolha a prefeitura</option>
        {cityHallsList}
      </Input>
    )
  }

  render() {
    return (
      <main>
      	<Row>
	        <Col s={12}>
            <div className='card'>
              <div className='card-content'>
                {this.props.is_edit ?
                  <h2 className="card-title">Alterar setor: {this.props.data.name}</h2> 
                  :
                  <h2 className="card-title">Cadastrar setor</h2> 
                }
                <Row className='first-line'>
                  <Col s={12} m={12} l={6}>
                    <div className="field-input" >
                      <h6>Prefeitura:</h6>
                      <div>                        
                        {this.pickCityHall()}
                      </div>
                    </div>
                    <div className="field-input" >
                      <h6>Situação:</h6>
                      <div>
                        <Input s={6} m={32} l={6} 
                               type='select'
                               name='situation'
                               value={this.state.service_place.active}
                               onChange={this.handleInputServicePlaceChange.bind(this)} 
                        >
                          <option key={0} value={true}>Ativo</option>
                          <option key={1} value={false}>Inativo</option>
                        </Input>
                      </div>
                    </div>
                    <div className="field-input" >
                      <h6>Nome:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="name" 
                          value={this.state.service_place.name} 
                          onChange={this.handleInputServicePlaceChange.bind(this)} 
                        />
                      </label>
                    </div>
                    <div className="field-input" >
                      <h6>CEP:</h6>
                      <label>
                        <MaskedInput
                          type="text"
                          className='input-field'
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
                    </div>

                    <div className="field-input" >
                      <h6>Estado do endereço:</h6>
                      <label>
                        <input
                          type="text"
                          className='input-field'
                          name="state_abbreviation"
                          value={this.state.aux.state_abbreviation}
                          disabled />
                      </label>
                    </div>

                    <div className="field-input" >
                      <h6>Munícipio:</h6>
                      <label>
                        <input
                          type="text"
                          className='input-field'
                          name="city"
                          value={this.state.aux.city_name}
                          disabled
                        />
                      </label>
                    </div>

                    <div className="field-input" >
                      <h6>Bairro:</h6>
                      <label>
                        <input
                          type="text"
                          className='input-field'
                          name="neighborhood"
                          value={this.state.aux.neighborhood}
                        />
                      </label>
                    </div>

                    <div className="field-input" >
                      <h6>Número:</h6>
                      <label>
                        <input
                          type="text"
                          className='input-field'
                          name="address_number"
                          value={this.state.service_place.address_number}
                          onChange={this.handleInputServicePlaceChange.bind(this)}
                        />
                      </label>
                    </div>

                    <div className="field-input" >
                      <h6>Complemento:</h6>
                      <label>
                        <input
                          type="text"
                          className='input-field'
                          name="address_complement"
                          value={this.state.service_place.address_complement}
                          onChange={this.handleInputServicePlaceChange.bind(this)} />
                      </label>
                    </div>

                    <div className="field-input">
                      <h6>Telefone 1:</h6>
                      <label>
                        <MaskedInput
                          mask={this.state.phonemask}
                          type="text"
                          className='input-field'
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
                    </div>

                    <div className="field-input">
                      <h6>Telefone 2:</h6>
                      <label>
                        <MaskedInput
                          mask={this.state.phonemask}
                          type="text"
                          className='input-field'
                          name="phone2"
                          value={this.state.service_place.phone2}
                          onChange={this.handleInputServicePlaceChange.bind(this)}
                        />
                      </label>
                    </div>

                    <div className="field-input">
                      <h6>E-mail:</h6>
                      <label>
                        <input
                          type="text"
                          className='input-field'
                          name="email"
                          value={this.state.service_place.email}
                          onChange={this.handleInputServicePlaceChange.bind(this)}
                        />
                      </label>
                    </div>

                    <div className="field-input">
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
                    </div>

                   <p><font color="red"> Campos com (*) são de preenchimento obrigatório.</font></p>
                  </Col>
                </Row>
                {this.confirmButton()}
              </div>
            </div>
          </Col>
        </Row>
      </main>
    )
  }
}

const ServicePlaceForm = connect()(getServicePlaceForm)
export default ServicePlaceForm
