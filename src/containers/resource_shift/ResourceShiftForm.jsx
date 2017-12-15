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
        if (this.props.is_edit){
          let time = this.transformTime(previous_data);
          this.setState({ resource_shift: previous_data,
            dates:[new Date(previous_data.execution_start_time)],
            time_start: time.begin_time,
            time_end: time.end_time
          });          
        }
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
      var resource = resp.find(r => Number(this.state.resource_shift.resource_id)=== r.id );
      this.setState({ selected_resource: resource });
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
    if(name == 'time_end' || name == 'time_start'){
      this.setState({[name]: value});
    }
    else{
      this.setState({
        resource_shift: update(this.state.resource_shift, { [name]: {$set: name =='active' ? Number(value):value} })
      });
    }

    if(name=='resource_types_id'){
      this.changeResourceType(value);
    }    
  }

  handleSubmit() {
    let errors = [];
    let formData = {};
    let dates = this.state.dates;

    let hour_begin = this.state.time_start.split(':')[0];
    let hour_end = this.state.time_end.split(':')[0];

    let minute_begin = this.state.time_start.split(':')[1];
    let minute_end = this.state.time_end.split(':')[1];

    if (this.props.is_edit){
      formData = this.state.resource_shift;
      formData['execution_start_time'] = new Date(dates[0].setHours(Number(hour_begin), Number(minute_begin)));
      formData['execution_end_time'] = new Date(dates[0].setHours(Number(hour_end), Number(minute_end)));
      formData['professional_responsible_id'] = Number(formData.professional_responsible_id);
      formData['situation'] = Boolean(formData['active']);
    }
    else{     
      formData = this.formatItems();
    }

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
      if(this.props.is_edit){
        fetch(`${apiUrl}/${collection}?${params}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' },
          method: this.props.fetch_method,
          body: JSON.stringify(fetch_body)
        }).then(parseResponse).then(resp => {
          Materialize.toast('Escala de recurso editado com sucesso.', 10000, 'green',function(){$('#toast-container').remove();});
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

    let hour_begin = this.state.time_start.split(':')[0];
    let hour_end = this.state.time_end.split(':')[0];

    let minute_begin = this.state.time_start.split(':')[1];
    let minute_end = this.state.time_end.split(':')[1];

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
    if(!this.props.is_edit) {
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
    else{      
      var resource = this.state.resource.find(r => Number(this.state.resource_shift.resource_id)=== r.id );

      return (
        <Input 
          name="resource_types_id" 
          type='select' 
          value={!resource ? 0 : Number(resource.resource_types_id)}
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

  formatResourceDisplay(r){
    var final_name;
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
    return final_name;
  }
  getProfessionalListForServicePlace(){
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
    return service_place_professional;
  }
  pickProfessionalEdit(service_place_and_professionals, current_service_place){
    let professionals;
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
      professionals = service_place_and_professionals.find(spnr => Number(current_service_place) === spnr.service_place_id).professionals;
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
  timeSizeFixer(time){
    if(time.length == 0){
      return '00';
    }
    else{
      if(time.length == 1){
        return '0' + time;
      }
      else{
        if(time.length == 2){
          return time;          
        }
        else{
          return time[0]+time[1];
        }
      }
    }
  }
  transformTime(previous_data){
    var begin_time = previous_data.execution_start_time;
    var end_time = previous_data.execution_end_time;
    var transfBegin_time = undefined;
    var transfEnd_time = undefined;
    if(end_time){
      transfBegin_time = this.timeSizeFixer((new Date(begin_time).getHours()).toString()) + ':' + this.timeSizeFixer((new Date(begin_time).getMinutes()).toString());
      transfEnd_time = this.timeSizeFixer((new Date(end_time).getHours()).toString()) + ':' + this.timeSizeFixer((new Date(end_time).getMinutes()).toString());    
    }
    return({day: this.state.resource_shift.execution_start_time,begin_time:transfBegin_time,end_time:transfEnd_time});
  }
  renderFormCreate(){
    return(
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
                    value={this.state.time_start} 
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
                    value={this.state.time_end} 
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
      </Row>);
  }
  renderFormEdit(){    
    var resource_id = undefined;
    var resource = undefined;
    var resource_type = undefined;
    var listSpProf = this.getProfessionalListForServicePlace();
    // var time = this.transformTime();
    if(this.state.resource_shift.resource_id){
      resource_id = this.state.resource_shift.resource_id;
    }
    if (resource_id)
      resource = this.state.resource.find(r => resource_id == r.id);
    if (resource){
      resource_type = this.state.resource_types.find(rt => resource.resource_types_id == rt.id);      
    }
    return(
      <Row className='first-line'>
        <Col s={12} m={12} l={12}>
      
          <div className="field-input" id="no-padding">
            <h6>Tipo de recurso*:</h6>  
            {resource_type ? resource_type.name : ''}
          </div>

          <div className="field-input" id="no-padding">
            <h6>Recurso*:</h6>
            {resource ? this.formatResourceDisplay(resource) : ''}
          </div>

          <div className="field-input" id="no-padding">
            <h6>Profissional responsável:</h6>
            {resource ? this.pickProfessionalEdit(listSpProf, resource.service_place_id) : ''}
          </div>               
 

          <div className="field-input" id="no-padding">
            <h6>Situação:</h6>
            <div>
              <Input s={6} m={32} l={12} 
                type='select'
                name='active'
                value={Number(this.state.resource_shift.active)}
                onChange={this.handleInputResourceChange.bind(this)} 
              >
                <option key={0} value={1}>Ativo</option>
                <option key={1} value={0}>Inativo</option>
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
                <Calendar save_days={this.save_days} order='asc' markedDays={this.state.dates} singleDay={true}/>
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
                    value={resource ? this.state.time_start: undefined} 
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
                    value={resource ? this.state.time_end : undefined}  
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
                name="notes" 
                placeholder="Adicione uma anotação"
                value={this.state.resource_shift.notes} 
                onChange={this.handleInputResourceChange.bind(this)} 
              />
            </label>
          </div>
      
          <p><font color="red"> Campos com (*) são de preenchimento obrigatório.</font></p>
        </Col>
      </Row>);
  }
  render() {
    return (
      <main>
        <Row>
          <Col s={12}>
            <div className='card'>
              <div className='card-content'>
                {this.props.is_edit ?
                  <h2 className="card-title">Alterar escala de recurso: {this.props.data.id}</h2> 
                  :
                  <h2 className="card-title">Cadastrar escala de recurso</h2> 
                }
                {this.props.is_edit ?
                  this.renderFormEdit() :
                  this.renderFormCreate() 
                }
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
