import {Component} from 'react';
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
      resource_types: [],
      service_place:[],
      professionals:[],
    };
    this.getResourceType = this.getResourceType.bind(this); 
    this.getServicePlace = this.getServicePlace.bind(this); 
    this.getProfessional = this.getProfessional.bind(this); 
  }

  componentWillMount() {
    var self = this;
    var role = this.props.current_role.id;
    this.getResourceType(role);

    if(this.props.current_role.role != 'adm_local')
      this.getServicePlace(role);
    
    this.getProfessional(role);
    if (this.props.is_edit)    
      var previous_data = {
        situation: Boolean(this.props.data.active),
        brand: this.props.data.brand,
        model: this.props.data.model,        
        label: this.props.data.label,
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
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
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
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
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
  getServicePlace(role) {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'service_places/';
    const params = `permission=${role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ service_place: resp });
    });
  }
  getProfessional(role) {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'professionals/';
    const params = `permission=${role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
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
  }

  handleSubmit() {
    let errors = [];
    let formData = {};
    formData = this.state.resource;
    if (!formData['brand'])
      errors.push('Campo marca é obrigatório');    

    if (!formData['model'])
      errors.push('Campo modelo é obrigatório');

    if(errors.length > 0) {
      let full_error_msg = '';
      errors.forEach(function(elem){ full_error_msg += elem + '\n' });
      Materialize.toast(full_error_msg, 10000, 'red',function(){$('#toast-container').remove()});
    } else {
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
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
    )
  }

  pickResourceType() {
    const resourceTypesList = (
      this.state.resource_types.map((resource_type) => {
        return (
          <option key={Math.random()} value={resource_type.id}>
            {resource_type.name}
          </option>
        );
      })
    );
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
    const resourceTypesList = (
      this.state.service_place.map((service_place) => {
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
                    
                
                    <div className="field-input" >
                      <h6>Marca*:</h6>
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
                      <h6>Modelo*:</h6>
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


                    <div className="field-input" id="no-padding">
                      <h6>Tipo de recurso*:</h6>
                      {this.pickResourceType()}
                    </div>

                    {
                      this.props.current_role.role != 'adm_local' ? 
                        <div className="field-input" id="no-padding" >
                          <h6>Local de atendimento*:</h6>
                          {this.pickServicePlace()}
                        </div>
                        :
                        <div/>
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
