import React, {Component} from 'react';
import { Link } from 'react-router';
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize';
import styles from './styles/ResourceForm.css';
import 'react-day-picker/lib/style.css';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import update from 'react-addons-update';

class getResourceForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      resource: {
        situation: true,
        brand: '',
        label: '',
        maximum_schedule_time: 0.0,
        minimum_schedule_time: 0.0,
        model: '',
        note: '',
        professional_responsible_id: 0,
        resource_types_id: 0,
        service_place_id: 0
      },
      previous_data: undefined,
      city_halls:[],
      resource_types: [],
      service_place:[],
      professionals:[],
      service_place_professional:[],
      service_place_of_professional:[],
      current_service_place_adm_local:[]
    };
    this.getResourceType = this.getResourceType.bind(this);
    this.getServicePlace = this.getServicePlace.bind(this);
    this.getProfessional = this.getProfessional.bind(this);
    this.getServicePlaceProfessional = this.getServicePlaceProfessional.bind(this);
  }

  componentWillMount() {
    var self = this;
    var role = this.props.current_role.id;
    this.getResourceType(role);

    if(this.props.current_role.role != 'adm_local'){
      this.getServicePlace(role);
      this.getCityHall(role);
    }

    this.getProfessional(role);
    this.getServicePlaceProfessional(role);

    if (this.props.is_edit)
      var previous_data = {
        situation: Boolean(this.props.data.active),
        brand: this.props.data.brand,
        model: this.props.data.model,
        label: this.props.data.label,
        note: this.props.data.note,
        maximum_schedule_time: this.props.data.maximum_schedule_time,
        minimum_schedule_time: this.props.data.minimum_schedule_time,
        professional_responsible_id: this.props.data.professional_responsible_id,
        resource_types_id: this.props.data.resource_types_id,
        service_place_id: this.props.data.service_place_id
      };
    if(this.props.current_role.role != 'adm_c3sl') {
      if (this.props.is_edit)
        this.setState({ resource: previous_data });
    }
    else {
      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
      const collection = 'forms/service_type_index';
      const params = this.props.fetch_params;
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json' },
        method: 'get',
      }).then(parseResponse).then(resp => {
        if (this.props.is_edit)
          this.setState({ resource: previous_data });
        self.setState({ city_halls: resp.city_halls });
      });
    }
  }

  getResourceType(role) {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'resource_types/';
    const params = `permission=${role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ resource_types: resp });
    });
  }

  getCityHall(role) {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'city_halls/';
    const params = `permission=${role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ city_halls: resp });
    });
  }

  getServicePlaceProfessional(role) {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'forms/create_shift/';
    const params = `permission=${role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ service_place_professional: resp,
        current_service_place_adm_local: resp.service_places[0]});


    });
  }
  getServicePlace(role) {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'service_places/';
    const params = `permission=${role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(completeResp => {
      let resp = completeResp.entries;
      self.setState({ service_place: resp });
    });
  }
  getProfessional(role) {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'professionals/';
    const params = `permission=${role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(completeResp => {
      let resp = completeResp.entries;
      self.setState({ professionals: resp });
    });
  }

  handleInputResourceChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      resource: update(this.state.resource, { [name]: {$set: value} })
    });

    if(name=='professional_responsible_id'){
      this.changeResourceProfessional(value);
    }
  }

  handleSubmit() {
    let errors = [];
    let formData = {};
    formData = this.state.resource;
    if(this.props.current_role.role == 'adm_local')
      formData.service_place_id = this.state.current_service_place_adm_local.id;
    if(errors.length > 0) {
      let full_error_msg = '';
      errors.forEach(function(elem){ full_error_msg += elem + '\n' });
      Materialize.toast(full_error_msg, 10000, 'red',function(){$('#toast-container').remove()});
    } else {
      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
      const collection = this.props.fetch_collection;
      const params = this.props.fetch_params;
      let fetch_body = {}
      if(this.props.is_edit) {
        fetch_body['resource'] = formData;
      }
      else {
        fetch_body = formData;
      }
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json' },
        method: this.props.fetch_method,
        body: JSON.stringify(fetch_body)
      }).then(parseResponse).then(resp => {
        if(this.props.is_edit)
          Materialize.toast('Tipo de recurso editado com sucesso.', 10000, 'green',function(){$('#toast-container').remove()});
        else
          Materialize.toast('Tipo de recurso criado com sucesso.', 10000, 'green',function(){$('#toast-container').remove()});
        browserHistory.push(this.props.submit_url)
      }).catch(({errors}) => {
        if(errors) {
          let full_error_msg = '';
          errors['full_messages'].forEach(function(elem){ full_error_msg += elem + '\n' });
          Materialize.toast(full_error_msg, 10000, 'red',function(){$('#toast-container').remove()});
          throw errors;
        }
      });
    }
  }

  confirmButton() {
    return (
      <div className="card-action">
        <a className='back-bt waves-effect btn-flat' href='#' onClick={this.props.prev}> Voltar </a>
        <button className="waves-effect btn right button-color" onClick={this.handleSubmit.bind(this)} name="commit" type="submit">{this.props.is_edit ? 'Atualizar' : 'Criar'}</button>
      </div>
    );
  }

  pickResourceType() {
    var resourceTypesList;

    if(this.props.current_role.role == 'adm_c3sl'){
      resourceTypesList = (
        this.state.resource_types.map((resource_type) => {
          return (
            <option key={Math.random()} value={resource_type.id}>
              {resource_type.name + ` - ${this.state.city_halls.find(c => resource_type.city_hall_id === c.id ).name}`}
            </option>
          );
        })
      );
    }
    else{
      resourceTypesList = (
        this.state.resource_types.map((resource_type) => {
          return (
            <option key={Math.random()} value={resource_type.id}>
              {resource_type.name}
            </option>
          );
        })
      );
    }

    return (
      <Input
        name="resource_types_id"
        type='select'
        value={this.state.resource.resource_types_id}
        onChange={
          (event) => {
            if(event.target.value != this.state.selected_resource_type) {
              this.handleInputResourceChange(event);
            }
          }
        }
      >
        <option value='0' disabled>Escolha o tipo de recurso</option>
        {resourceTypesList}
      </Input>
    );
  }

  pickServicePlace() {

    var sp = this.state.service_place_of_professional.length > 0 ?
      this.state.service_place_of_professional
      :
      this.state.service_place;

    const resourceTypesList = (
      sp.map((service_place) => {
        return (
          <option key={Math.random()} value={service_place.id}>
            {service_place.name}
          </option>
        );
      })
    );
    return (
      <Input
        name="service_place_id"
        type='select'
        value={this.state.resource.service_place_id}
        onChange={
          (event) => {
            if(event.target.value != this.state.selected_service_place) {
              this.handleInputResourceChange(event);
            }
          }
        }
      >
        <option value='0' disabled>Escolha o local do recurso</option>
        {resourceTypesList}
      </Input>
    );
  }

  pickProfessional() {
    const resourceTypesList = (
      this.state.professionals.map((professional) => {
        return (
          <option key={Math.random()} value={professional.id}>
            {professional.name}
          </option>
        );
      })
    );
    return (
      <Input
        name="professional_responsible_id"
        type='select'
        value={this.state.resource.professional_responsible_id}
        onChange={
          (event) => {
            if(event.target.value != this.state.selected_professional) {
              this.handleInputResourceChange(event);
            }
          }
        }
      >
        <option value='0' disabled>Escolha o profissional responsável</option>
        {resourceTypesList}
      </Input>
    );
  }

  changeResourceProfessional(id){
    if(this.state.resource.professional_responsible_id != 0){
      let professionals = this.state.service_place_professional.professionals;
      let professional = (professionals.find(p => Number(id) === p.id ));
      let service_places = [];
      for(let i = 0, j = 0; i < this.state.service_place.length; i++){
        if(this.state.service_place[i].id == professional.service_place_ids[j]){
          j++;
          service_places.push(this.state.service_place[i]);
          if(j-1 > professional.service_place_ids.length)
            break;
        }
      }
      this.setState({ service_place_of_professional: service_places });
    }
  }

  render() {
    return (
      <main>
        <Row>
          <Col s={12}>
            <div className='card'>
              <div className='card-content'>
                {this.props.is_edit ?
                  <h2 className="card-title">Alterar recurso: {this.props.data.name}</h2>
                  :
                  <h2 className="card-title">Cadastrar recurso</h2>
                }
                <Row className='first-line'>
                  <Col s={12} m={12} l={12}>

                    <div className="field-input" id="no-padding">
                      <h6>Tipo de recurso*:</h6>
                      {this.pickResourceType()}
                    </div>

                    <div className="field-input" >
                      <h6>Marca:</h6>
                      <label>
                        <input
                          type="text"
                          className='input-field'
                          name="brand"
                          value={this.state.resource.brand}
                          onChange={this.handleInputResourceChange.bind(this)}
                        />
                      </label>
                    </div>


                    <div className="field-input" >
                      <h6>Modelo:</h6>
                      <label>
                        <input
                          type="text"
                          className='input-field'
                          name="model"
                          value={this.state.resource.model}
                          onChange={this.handleInputResourceChange.bind(this)}
                        />
                      </label>
                    </div>

                    <div className="field-input" >
                      <h6>Etiqueta:</h6>
                      <label>
                        <input
                          type="text"
                          className='input-field'
                          name="label"
                          value={this.state.resource.label}
                          onChange={this.handleInputResourceChange.bind(this)}
                        />
                      </label>
                    </div>

                    <div id="field-textarea">
                      <h6>Nota:</h6>
                      <label>
                        <textarea
                          className='input-field materialize-textarea black-text'
                          name="note"
                          placeholder="Adicione uma anotação"
                          value={this.state.resource.note}
                          onChange={this.handleInputResourceChange.bind(this)}
                        />
                      </label>
                    </div>

                    <div>
                      <h6>Tempo mínimo de escala*:</h6>
                      <label>
                        <input
                          type="number"
                          id="number-input"
                          step="0.5"
                          min="0"
                          className='input-field'
                          name="minimum_schedule_time"
                          value={this.state.resource.minimum_schedule_time}
                          onChange={this.handleInputResourceChange.bind(this)}
                        />
                        <span id="unitTime">h</span>
                      </label>
                    </div>

                    <div>
                      <h6>Tempo máximo de escala*:</h6>
                      <label>
                        <input
                          type="number"
                          id="number-input"
                          step="0.5"
                          min="0"
                          className='input-field'
                          name="maximum_schedule_time"
                          value={this.state.resource.maximum_schedule_time}
                          onChange={this.handleInputResourceChange.bind(this)}
                        />
                        <span id="unitTime">h</span>
                      </label>
                    </div>

                    <div className="field-input" id="no-padding">
                      <h6>Profissional responsável:</h6>
                      {this.pickProfessional()}
                    </div>


                    {
                      this.props.current_role.role != 'adm_local' ?
                        <div className="field-input" id="no-padding" >
                          <h6>Local de atendimento*:</h6>
                          {this.pickServicePlace()}
                        </div>
                        :
                        <div className="field-input" id="no-padding" >
                          <h6>Local de atendimento*:</h6>
                          <Input s={6} m={32} l={12}
                            type='select'
                            name='service_place_id'
                          >
                            <option value={this.state.current_service_place_adm_local.id}>{this.state.current_service_place_adm_local.name}</option>
                          </Input>
                        </div>
                    }

                    <div className="field-input">
                      <h6>Situação:</h6>
                      <div>
                        <Input s={6} m={32} l={12}
                          type='select'
                          name='situation'
                          value={this.state.resource.situation}
                          onChange={this.handleInputResourceChange.bind(this)}
                        >
                          <option key={0} value={true}>Ativo</option>
                          <option key={1} value={false}>Inativo</option>
                        </Input>
                      </div>
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
    );
  }
}

const ResourceForm = connect()(getResourceForm );
export default ResourceForm;
