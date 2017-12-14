import {Component} from 'react';
import { Link } from 'react-router';
import { Button, Card, Row, Col, Input, Collection, CollectionItem } from 'react-materialize';
import styles from './styles/ResourceForm.css';
import 'react-day-picker/lib/style.css';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import DayPicker, { DateUtils } from 'react-day-picker';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import update from 'react-addons-update';
import strftime from 'strftime';
import Calendar from './Calendar';

class getResourceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource_shift:{
        active:1,
        borrowed:0,
        execution_end_time:'',
        execution_start_time:'',
        next_shift_id:null,
        notes:'',
        professional_responsible_id:0,
        resource_id:0,
      },
      previous_data: undefined,
      current_service_place:'',
      city_halls:[],
      resource_types: [],
      professionals:[],
      resource: [],
      pickable_resource:[],
      current_resource:{},
      resource_types_id:'',
      service_place_with_professional:{},
      service_place_and_professionals:[],
      service_place:{},
      dates:[],
      time_start:'',
      time_end:''
    };
    this.save_days = this.save_days.bind(this);
    this.getResourceType = this.getResourceType.bind(this); 
    this.getResource = this.getResource.bind(this); 
    this.getCityHall = this.getCityHall.bind(this);
    this.getServicePlaceWithProfessional = this.getServicePlaceWithProfessional.bind(this);
    this.formatItems = this.formatItems.bind(this);
  }

  componentWillMount() {
    var self = this;
    var role = this.props.current_role.id;
    this.getResourceType(role);
    this.getResource(role);

    if(this.props.current_role.role != 'adm_local'){
      this.getCityHall(role);
    }
    
    this.getServicePlaceWithProfessional(role);

    if (this.props.is_edit)    
      var previous_data = {
        situation:Boolean(this.props.data.active),
        borrowed:Boolean(this.props.data.borrowed),
        execution_end_time:this.props.data.execution_end_time,
        execution_start_time:this.props.data.execution_start_time,
        next_shift_id:this.props.data.next_shift_id,
        notes:this.props.data.notes,
        professional_responsible_id:this.props.data.professional_responsible_id,
        resource_id:this.props.data.resource_id
      };
    if(this.props.current_role.role != 'adm_c3sl') {
      if (this.props.is_edit)
        this.setState({ resource_shift: previous_data });
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

  getServicePlaceWithProfessional(role) {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'forms/shift_index/';
    const params = `permission=${role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ 
        service_place_with_professional:resp, 
        professionals:resp.professionals,
        service_place:resp.service_places
      });
    });
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
  
  getResource(role) {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'resources/';
    const params = `permission=${role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ resource: resp });
    });
  }

  getCityHall(role) {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
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
  
  buildServicePlaceArray(){
    var service_place_professional = [];
    var professionals = this.state.professionals;
    var service_place = this.state.service_place;
    
    for(let i = 0; i < service_place.length; i++ ){
      let item = {service_place_id: service_place[i].id, service_place_name: service_place[i].name};
      var professional = [];
      for(let j = 0; j < professionals.length; j++){
        for (let k = 0; k < professionals[j].service_place_ids.length; k++){          
          if (Number(professionals[j].service_place_ids[k]) == Number(service_place[i].id)){
            professional.push({professional_id:professionals[j].id, professional_name:professionals[j].name});
          }
        }
        item['professionals'] = professional;
      }
      service_place_professional.push(item);
    }
    this.setState({service_place_and_professionals: service_place_professional});
  }


  handleInputResourceChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name == 'resource_types_id' || name == 'current_resource'){
      this.setState({[name]: value}); 
      if (name == 'current_resource'){
        let service_place = this.state.resource.find(r => Number(value)=== r.id ).service_place_id;
        this.setState({current_service_place: `${service_place}`});
        this.buildServicePlaceArray();
      }
    }    
    this.setState({
      resource_shift: update(this.state.resource_shift, { [name]: {$set: value} })
    });

    if(name=='resource_types_id'){
      this.changeResourceType(value);
    }    
  }

  handleSubmit() {
    this.formatItems();
    let errors = [];
    let formData = {};

    if (this.props.is_edit){
      formData = this.state.resource_shift;
    }
    else{
      formData = this.formatItems();
    }
    if(this.props.current_role.role == 'adm_local')
      formData.service_place_id = this.state.current_service_place_adm_local.id;
    if(errors.length > 0) {
      let full_error_msg = '';
      errors.forEach(function(elem){ full_error_msg += elem + '\n'; });
      Materialize.toast(full_error_msg, 10000, 'red',function(){$('#toast-container').remove();});
    } else {
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = this.props.fetch_collection;
      const params = this.props.fetch_params; 
      let fetch_body = {};
      if(this.props.is_edit) {
        fetch_body['resource_shift'] = formData;
      }
      else {
        var bodies = [];
        for(let i = 0; i < formData.length; i++){
          bodies.push({resource_shift:formData[i]});
        }        
      }
      console.log(bodies);
      if(this.props.is_edit){
        fetch(`${apiUrl}/${collection}?${params}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' },
          method: this.props.fetch_method,
          body: JSON.stringify(fetch_body)
        }).then(parseResponse).then(resp => {
          if(this.props.is_edit)
            Materialize.toast('Escala de recurso editado com sucesso.', 10000, 'green',function(){$('#toast-container').remove();});
          else
            Materialize.toast('Escala de recurso criado com sucesso.', 10000, 'green',function(){$('#toast-container').remove();});
          browserHistory.push(this.props.submit_url);
        }).catch(({errors}) => {
          if(errors) {
            let full_error_msg = '';
            errors['full_messages'].forEach(function(elem){ full_error_msg += elem + '\n'; });
            Materialize.toast(full_error_msg, 10000, 'red',function(){$('#toast-container').remove();});
            throw errors;
          }
        });
      }
      else {
        for(let i = 0; i < bodies.length; i++){

          fetch(`${apiUrl}/${collection}?${params}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json' },
            method: this.props.fetch_method,
            body: JSON.stringify(bodies[i])
          }).then(parseResponse).then(resp => {
            Materialize.toast('Tipo de recurso criado com sucesso.', 10000, 'green',function(){$('#toast-container').remove();});
            browserHistory.push(this.props.submit_url);
          }).catch(({errors}) => {
            if(errors) {
              let full_error_msg = '';
              errors.forEach(function(elem){ full_error_msg += elem + '\n'; });
              Materialize.toast(full_error_msg, 10000, 'red',function(){$('#toast-container').remove();});
              throw errors;
            }
          });
        }
      }

    }
  }

  formatItems(){

    var final_resource_shifts = [];
    let formData = this.state.resource_shift;
    var dates = this.state.dates;

    let hour_begin = formData.time_start.split(':')[0];
    let hour_end = formData.time_end.split(':')[0];

    let minute_begin = formData.time_start.split(':')[1];
    let minute_end = formData.time_end.split(':')[1];

    let number_of_shifts = dates.length;
    let aux = {};

    
    for(let i = 0; i < number_of_shifts; i++){
      aux['active'] = formData.active;
      aux['borrowed'] = formData.borrowed;
      aux['execution_start_time'] = new Date(dates[i].setHours(Number(hour_begin), Number(minute_begin)));
      aux['execution_end_time'] = new Date(dates[i].setHours(Number(hour_end), Number(minute_end)));
      aux['notes'] = formData.note;
      aux['professional_responsible_id'] = Number(formData.professional_responsible_id);
      aux['resource_id'] = Number(this.state.current_resource);
      final_resource_shifts.push(aux);
      aux = {};    
    }
    this.setState({resource_shift:final_resource_shifts});
    return final_resource_shifts;

  }

  confirmButton() {
    return (
      <div className="card-action">
        <a className='back-bt waves-effect btn-flat' href='#' onClick={this.props.prev}> Voltar </a>
        <button className="waves-effect btn right button-color" onClick={this.handleSubmit.bind(this)} name="commit" type="submit">{this.props.is_edit ? 'Atualizar' : 'Criar'}</button>
        {/* <button className="waves-effect btn right button-color" onClick={this.formatItems.bind(this)} name="commit" type="submit">{this.props.is_edit ? 'Atualizar' : 'Criar'}</button> */}
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
        value={this.state.resource_types_id}
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

  pickResource() {
    const resourceList = (
      this.state.pickable_resource.map((r) => {
        let final_name = '';
        if(r){
          if(r.label.length > 0){
            if (r.brand.length > 0){
              if (r.model.length > 0){
                final_name = `[${r.brand}] ${r.model} (${r.label})`;
              }
              else{
                final_name = `${r.brand} - ${r.label}`;
              }
            }
            else{
              final_name = `${r.label}`;          
            }
          }
          else{
            final_name =`ID do recurso: ${r.id}`;
          }
        }
        else{
          final_name = 'Não existe recurso deste tipo';
        }
        return (
          <option key={Math.random()} value={r ? r.id : 0}>
            {final_name}  
          </option>
        );
      })
    );
    return (
      <Input 
        name="current_resource" 
        type='select' 
        value={this.state.current_resource}
        onChange={
          (event) => {
            if(event.target.value != this.state.selected_professional) {
              this.handleInputResourceChange(event);
            }
          }
        }
      >
        <option value='0' disabled>Escolha o recurso</option>
        {resourceList}
      </Input>
    );
  }

  pickProfessional() {
    let professionals;
    let  service_place_and_professionals = this.state.service_place_and_professionals;
    if (service_place_and_professionals.length < 1){
      return (
        <Input 
          name="professional_responsible_id" 
          type='select' 
          value={this.state.resource_shift.professional_responsible_id}
          onChange={
            (event) => {
              if(event.target.value != this.state.selected_professional) {
                this.handleInputResourceChange(event);
              }
            }
          }
        >
          <option value='0' disabled>Escolha o profissional responsável</option>
        </Input>
      );
    }
    else{
      professionals = service_place_and_professionals.find(spnr => Number(this.state.current_service_place) === spnr.service_place_id).professionals;
    }
    const professionalList = (
      professionals.map((professional) => {
        return (
          <option key={Math.random()} value={professional.professional_id}>
            {professional.professional_name}
          </option>
        );       
      })
    );
    return (
      <Input 
        name="professional_responsible_id" 
        type='select' 
        value={this.state.resource_shift.professional_responsible_id}
        onChange={
          (event) => {
            if(event.target.value != this.state.selected_professional) {
              this.handleInputResourceChange(event);
            }
          }
        }
      >
        <option value='0' disabled>Escolha o profissional responsável</option>
        {professionalList}
      </Input>
    );
  }

  changeResourceType(id){
    let resource_types = [];
    for(let i = 0; i < this.state.resource.length; i++){
      if( this.state.resource[i].resource_types_id === Number(id) ){
        resource_types.push( this.state.resource[i] );
      }
    }
    this.setState({ pickable_resource: resource_types });    
  }

  save_days(dates){
    this.setState({dates: dates});
  }

  render() {  
    return (
      <main>
        <Row>
          <Col s={12}>
            <div className='card'>
              <div className='card-content'>
                {this.props.is_edit ?
                  <h2 className="card-title">Alterar escala de recurso: {this.props.data.name}</h2> 
                  :
                  <h2 className="card-title">Cadastrar escala de recurso</h2> 
                }
                <Row className='first-line'>
                  <Col s={12} m={12} l={12}>
                    
                    <div className="field-input" id="no-padding">
                      <h6>Tipo de recurso*:</h6>
                      {this.pickResourceType()}
                    </div>

                    <div className="field-input" id="no-padding">
                      <h6>Recurso*:</h6>
                      {this.pickResource()}
                    </div>

                    <div className="field-input" id="no-padding">
                      <h6>Profissional responsável:</h6>
                      {this.pickProfessional()}
                    </div>               
               

                    <div className="field-input" id="no-padding">
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

                    <Collection>
                      <CollectionItem style={{textAlign:'center', fontSize:'large'}}>
                        <b>ATENÇÃO:</b> Os horários serão aplicados para todos os dias selecionados
                      </CollectionItem>
                    </Collection>

                    <Row>
                      <Col s={12} m={6}>
                        <div style={{marginBottom:20}}>
                          <h6 style={{marginBottom:30}}>Escolha as datas das escalas*:</h6>
                          <Calendar save_days={this.save_days} order='asc'/>
                        </div>
                      </Col>

                      <Col s={12} m={6} id='time-shift'>                        
                        <div className="" >
                          <h6 style={{marginBottom:30}}>Escolha o horário inicial da(s) escala(s)*:</h6>
                          <label>
                            <input 
                              type="time" 
                              id='time-select' 
                              name="time_start" 
                              value={this.state.resource.label} 
                              onChange={this.handleInputResourceChange.bind(this)} 
                            />
                          </label>
                          <span>h</span>
                        </div>

                        <div className="" >
                          <h6 style={{marginBottom:30}}>Escolha o horário final da(s) escala(s)*:</h6>
                          <label>
                            <input 
                              type="time" 
                              id='time-select' 
                              name="time_end" 
                              value={this.state.resource.label} 
                              onChange={this.handleInputResourceChange.bind(this)} 
                            />
                          </label>
                          <span>h</span>
                        </div>

                      </Col>
                    </Row>

                    <div id="field-textarea">
                      <h6>Nota:</h6>
                      <label>
                        <textarea  
                          className='input-field materialize-textarea black-text'
                          name="note" 
                          placeholder="Adicione uma anotação"
                          value={this.state.resource_shift.note} 
                          onChange={this.handleInputResourceChange.bind(this)} 
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
    );
  }
}

const ResourceForm = connect()(getResourceForm );
export default ResourceForm;
