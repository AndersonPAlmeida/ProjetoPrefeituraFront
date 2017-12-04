import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ResourceForm.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import { ResourceImg } from '../images';
import MaskedInput from 'react-maskedinput';
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
      city_halls: [],
      resource_types: []
    };
    this.getResourceType = this.getResourceType.bind(this); 
  }

  componentWillMount() {
    var self = this;
    var role = this.props.current_role.id
    this.getResourceType(role)
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
      }
    if(this.props.current_role.role != 'adm_c3sl') {

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
        if (this.props.is_edit)
          this.setState({ resource: previous_data })
        self.setState({ city_halls: resp.city_halls })
      });
    }

  }

  getResourceType(role) {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_types/`;
    const params = `permission=${role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ resource_types: resp })
    });
  }

  handleInputResourceChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    

    this.setState({
      resource: update(this.state.resource, { [name]: {$set: value} })
    })
  }

  handleSubmit() {
    let errors = [];
    let formData = {};
    formData = this.state.resource;

    if(!formData['name'])
      errors.push("Campo Nome é obrigatório.");
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
        fetch_body['resource'] = formData
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
          Materialize.toast('Tipo de recurso editado com sucesso.', 10000, "green",function(){$("#toast-container").remove()});
        else
          Materialize.toast('Tipo de recurso criado com sucesso.', 10000, "green",function(){$("#toast-container").remove()});
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

  pickResourceType() {

    const resourceTypesList = (
      this.state.resource_types.map((resource_type) => {
        return (
          <option value={resource_type.id}>{resource_type.name}</option>
        )
      })
    )
    return (
      <Input 
        name="resource_type_id" 
        type='select' 
        value={this.state.resource.resource_types_id}
        onChange={
          (event) => {
            if(event.target.value != this.state.selected_resource_type) {
                this.handleInputSectorChange(event);
            }
          }
        }
      >
        <option value='0' disabled>Escolha o tipo de recurso</option>
        {resourceTypesList}
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
                    <h6>Etiqueta*:</h6>
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

                  <div className="field-input" >
                    <h6>Profissional responsável*:</h6>
                    <label>
                      <input 
                        type="text" 
                        className='input-field' 
                        name="professional_responsible_id" 
                        value={this.state.resource.professional_responsible_id} 
                        onChange={this.handleInputResourceChange.bind(this)} 
                      />
                    </label>
                  </div>


                  <div className="field-input" >
                    <h6>Tipo de recurso*:</h6>
                    {this.pickResourceType()}
                  </div>


                  <div className="field-input" >
                    <h6>Local de atendimento*:</h6>
                    <label>
                      <input 
                        type="text" 
                        className='input-field' 
                        name="service_place_id" 
                        value={this.state.resource.service_place_id} 
                        onChange={this.handleInputResourceChange.bind(this)} 
                      />
                    </label>
                  </div>
                    <div className="field-input" >
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
    )
  }
}

const ResourceForm = connect()(getResourceForm )
export default ResourceForm
