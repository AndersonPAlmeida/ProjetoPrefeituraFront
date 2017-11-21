import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ServiceTypeForm.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import { ServiceTypeImg } from '../images';
import MaskedInput from 'react-maskedinput';
import update from 'react-addons-update';

class getServiceTypeForm extends Component {

 constructor(props) {
    super(props)
    this.state = {
      service_type: { 
        active: true,
        description: '',
        sector_id: 0,
        city_hall_id: 0
      },
      update_service_types: 0,
      sectors: [],
      city_halls: [] 
    };
  }

  componentWillMount() {
    var self = this;
    if(this.props.is_edit) {
      self.setState({ service_type: this.props.data })
    }
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    var collection = 'forms/create_service_type';
    const params = this.props.fetch_params;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ sectors: resp.sectors })
    });
    if(this.props.current_role.role != 'adm_c3sl') {
      this.setState({
        service_type: update(this.state.service_type, { ['city_hall_id']: {$set: this.props.current_role.city_hall_id} })
      })
    }
    else {
      collection = 'forms/service_type_index';
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

  componentDidUpdate() {
    if(this.state.update_service_types != 0) {
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = 'forms/create_service_type';
      const params = this.props.fetch_params;
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get",
      }).then(parseResponse).then(resp => {
        this.setState({ sectors: resp.sectors, update_sectors: 0 })
      });
    }
  }

  handleInputServiceTypeChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      service_type: update(this.state.service_type, { [name]: {$set: value} })
    })
  }

  handleSubmit() {
    let errors = [];
    let formData = {};
    formData = this.state.service_type;

    if(!formData['description'])
      errors.push("Campo Descrição é obrigatório.");
    if(errors.length > 0) {
      let full_error_msg = "";
      errors.forEach(function(elem){ full_error_msg += elem + '\n' });
      Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
    } else {
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = this.props.fetch_collection;
      const params = this.props.fetch_params; 
      let fetch_body = {}
      if(this.props.is_edit) {
        fetch_body['service_type'] = formData
      }
      else {
        fetch_body = formData
      }
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

  pickSector() {
    const sectorsList = (
      this.state.sectors.map((sector) => {
        return (
          <option value={sector.id}>{sector.name}</option>
        )
      })
    )
    return (
      <div className='select-field'>
        <h6>Setor*:</h6>
        <br></br>
        <div>
          <Row className='sector-select'>
            <Input s={12} l={4} m={12} name="sector_id" type='select' value={this.state.service_type.sector_id}
              onChange={this.handleInputServiceTypeChange.bind(this)} 
            >
              <option value='0' disabled>Escolha o setor</option>
              {sectorsList}
            </Input>
          </Row>
        </div>
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
        value={this.state.service_type.city_hall_id}
        onChange={
          (event) => {
            if(event.target.value != this.state.selected_city_hall) {
                this.handleInputServiceTypeChange(event);
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
                  <h2 className="card-title">Alterar tipo de atendimento: {this.props.data.name}</h2> 
                  :
                  <h2 className="card-title">Cadastrar tipo de atendimento</h2> 
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
                      <h6>Situação*:</h6>
                      <div>
                        <Input s={6} m={32} l={6} 
                               type='select'
                               name='active'
                               value={this.state.service_type.active}
                               onChange={this.handleInputServiceTypeChange.bind(this)} 
                        >
                          <option key={0} value={true}>Ativo</option>
                          <option key={1} value={false}>Inativo</option>
                        </Input>
                      </div>
                    </div>
                    <div className="field-input" >
                      <h6>Descrição*:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="name" 
                          value={this.state.service_type.description} 
                          onChange={this.handleInputServiceTypeChange.bind(this)} 
                        />
                      </label>
                    </div>
                    {this.pickSector()}
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

const ServiceTypeForm = connect()(getServiceTypeForm)
export default ServiceTypeForm
