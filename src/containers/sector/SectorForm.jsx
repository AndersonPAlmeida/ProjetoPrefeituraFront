import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/SectorForm.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import MaskedInput from 'react-maskedinput';
import update from 'react-addons-update';

class getSectorForm extends Component {

 constructor(props) {
    super(props)
    this.state = {
      sector: { 
        active: true,
        absence_max: '',
        blocking_days: '',
        cancel_limt: '',
        description: '',
        name: '',
        previous_notice: '',
        schedules_by_sector: '',
        city_hall_id: 0 
      },
      city_halls: []
    };
  }

  componentDidMount() {
    var self = this;
    var data = this.props.is_edit ? this.props.data : this.state.sector
    if(this.props.current_role && this.props.current_role.role == 'adm_c3sl') {
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
    else
      data['city_hall_id'] = this.props.current_role.city_hall_id
    self.setState({ sector: data })
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
        { id: 'absence_max', name: 'Numero de faltas para gerar impedimento' },
        { id: 'blocking_days', name: 'Número de dias de impedimento' },
        { id: 'cancel_limit', name: 'Limite de cancelamentos' },
        { id: 'previous_notice', name: 'Horas de antecedências' },
        { id: 'description', name: 'Descrição' },
        { id: 'schedules_by_sector', name: 'Agendamentos por setor' }
      ]
    errors = this.checkEmptyFields(formData, form_mandatory)
    return errors;
  }

  handleInputSectorChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if(target.validity.valid) {
      this.setState({
        sector: update(this.state.sector, { [name]: {$set: value} })
      })
    }
  }

  handleSubmit() {
    let formData = this.state.sector;
    let errors = this.checkErrors.bind(this)(formData)
    if(errors.length > 0) {
      let full_error_msg = "";
      errors.forEach(function(elem){ full_error_msg += elem + '\n' });
      Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
    } else {
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = this.props.fetch_collection;
      const params = this.props.fetch_params; 
      let fetch_body = {}
      fetch_body['sector'] = formData
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
      }).catch(({errors}) => { // // TODO: UPDATE ERRORS ARRAY ACCORDING TO API
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
    if(this.props.current_role && this.props.current_role.role != 'adm_c3sl') {
      return (
        <input disabled
           name="selected_city_hall" 
           type='text' 
           className='input-field' 
           value={this.props.current_role.city_hall_name} 
        />
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
        value={this.state.sector.city_hall_id}
        onChange={
          (event) => {
            if(event.target.value != this.state.selected_city_hall) {
                this.handleInputSectorChange(event);
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
      <Row s={12}>
        <div className='card'>
          <div className='card-content'>
            <Row></Row>

            <Row s={12}>
              {this.props.is_edit ?
                <h2 className="card-title">Alterar setor: {this.props.data.name}</h2> 
                :
                <h2 className="card-title">Cadastrar setor</h2> 
              }
            </Row>

            <Row s={12}>
              <Col s={12} m={6}>
                <Row></Row>
                <Row s={6}>
                  <h6>Prefeitura*:</h6>
                  <div>
                    {this.pickCityHall()}
                  </div>
                </Row>

                <Row s={6}>
                  <h6>Situação*:</h6>
                  <div>
                    <Input s={6} m={32} l={6} 
                           type='select'
                           name='active'
                           value={this.state.sector.active}
                           onChange={this.handleInputSectorChange.bind(this)} 
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
                      value={this.state.sector.name} 
                      onChange={this.handleInputSectorChange.bind(this)} 
                    />
                  </label>
                </Row>

                <Row s={6}>
                  <h6>Número de agendamentos por setor*:</h6>
                  <label>
                    <input 
                      type="text" 
                      name="schedules_by_sector" 
                      pattern="[0-9]*"
                      value={this.state.sector.schedules_by_sector} 
                      onChange={this.handleInputSectorChange.bind(this)} 
                    />
                  </label>
                </Row>

                <Row s={6}>
                  <h6>Número de dias de impedimento de novos agendamentos*:</h6>
                  <label>
                    <input 
                      type="text" 
                      name="blocking_days" 
                      pattern="[0-9]*"
                      value={this.state.sector.blocking_days} 
                      onChange={this.handleInputSectorChange.bind(this)} 
                    />
                  </label>
                </Row>
              </Col>

              <Col s={12} m={6}>
                <Row></Row>

                <Row s={6}>
                  <h6>Limite de cancelamentos*:</h6>
                  <label>
                    <input 
                      type="text" 
                      name="cancel_limit" 
                      pattern="[0-9]*"
                      value={this.state.sector.cancel_limit} 
                      onChange={this.handleInputSectorChange.bind(this)} 
                    />
                  </label>
                </Row>

                <Row s={6}>
                  <h6>Horas de antecedências para poder cancelar um atendimento*:</h6>
                  <label>
                    <input 
                      type="text" 
                      name="previous_notice" 
                      pattern="[0-9]*"
                      value={this.state.sector.previous_notice} 
                      onChange={this.handleInputSectorChange.bind(this)} 
                    />
                  </label>
                </Row>

                <Row s={6}>
                  <h6>Número de faltas que gera impedimento de novos agendamentos*:</h6>
                  <label>
                    <input 
                      type="text" 
                      name="absence_max" 
                      pattern="[0-9]*"
                      value={this.state.sector.absence_max} 
                      onChange={this.handleInputSectorChange.bind(this)} 
                    />
                  </label>
                </Row>

                <Row s={6}>
                  <h6>Descrição*:</h6>
                  <label>
                    <textarea  
                      className='input-field materialize-textarea'
                      name="description" 
                      value={this.state.sector.description} 
                      onChange={this.handleInputSectorChange.bind(this)} 
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
    )
  }
}

const SectorForm = connect()(getSectorForm)
export default SectorForm
