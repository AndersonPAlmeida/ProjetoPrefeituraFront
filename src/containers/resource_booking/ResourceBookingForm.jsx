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
      resource_booking:{

      },
      previous_data: undefined,
      current_service_place:'',
      city_halls:[],
      resource_types: [],
      professionals:[],
      resource: '',
      pickable_resource:[],
      current_resource:{},
      resource_types_id:'', 
      service_place_with_professional:{},
      service_place_and_professionals:[],
      service_place:{},
      dates:[],
      citizens:[],
      selected_citizen:0,
      selected_shift:0
    };
    this.save_days = this.save_days.bind(this);
    this.getResourceType = this.getResourceType.bind(this); 
    this.getResource = this.getResource.bind(this); 
    this.getCityHall = this.getCityHall.bind(this);
    this.getServicePlaceWithProfessional = this.getServicePlaceWithProfessional.bind(this);
  }

  componentWillMount() {
    var self = this;
    var role = this.props.current_role.id;
    this.getResourceType(role);
    this.getResource(role);
    this.getCitizens(role);
    this.getExtraDetails(role);

    if(this.props.current_role.role != 'adm_local'){
      this.getCityHall(role);
    }
    
    this.getServicePlaceWithProfessional(role);

    if (this.props.is_edit)  {  
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
      this.setState({status: this.props.data.status});
    }
    if(this.props.current_role.role != 'adm_c3sl') {
      if (this.props.is_edit)
        this.setState({ resource_booking: previous_data });
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
          this.setState({ resource_booking: previous_data,
            dates:[new Date(previous_data.execution_start_time)],
            time_start: time.begin_time,
            time_end: time.end_time
          });          
        }
        self.setState({ city_halls: resp.city_halls });
      });
    }

  }

  getProfessionalNameResource(id, role) {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_shift_professional_responsible/${id}`;
    const params = `permission=${role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ professional_name_resource: resp.professional_name });
    });
  }

  getDetails(id, role) {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_details/${id}`;
    const params = `permission=${role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ service_place: resp.service_place });
    });
  }

  getExtraDetails(role) {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'resource_bookings_get_extra_info/';
    const params = `permission=${role}&view=${role != 'citizen' ? 'professional' : 'citizen'}`;

    var id = Number(this.props.fetch_collection.split('/')[1]);
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      let fetch_response = resp.find(r => r.resource_booking_id === id);
      let resource = fetch_response.resource;
      this.getProfessionalNameResource(Number(resource.professional_responsible_id),role);
      this.getDetails(resource.id, role);
      self.setState({ 
        resource_bookings_details: fetch_response,
        resource: fetch_response.resource
      });
    });
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
      var resource = resp.find(r => Number(this.state.resource_booking.resource_id)=== r.id );
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
      self.setState({ city_halls: resp.entries });
    });
  }
  
  getCitizens(role) {
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'citizens/';
    const params = `permission=${role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      this.setState({ citizens: resp.entries });
    });
  }

  getShifts(value){
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'resource_shifts/';
    const params = `permission=${this.props.current_role.id}&q[resource_id]=${Number(value)}&q[borrowed]=0&q[active]=1`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      this.setState({ resource_shifts: resp });
    });
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
        this.getShifts(value);
      }
    }   
    if(name == 'time_end' || name == 'time_start' || name == 'selected_citizen' || name =='selected_shift' || name == 'status'){
      this.setState({[name]: value});
    }
    else{
      this.setState({
        resource_booking: update(this.state.resource_booking, { [name]: {$set: name =='active' ? Number(value):value} })
      });
    }

    if(name=='resource_types_id'){
      this.changeResourceType(value);
    }    
  }

  handleSubmit() {
    let errors = [];
    let formData = {};
    
    if (this.props.is_edit){
      formData = this.state.resource_booking;
      formData['status'] = this.state.status;
    }
    else{     
      formData = this.buildBody();
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
        fetch_body['resource_booking'] = formData;
      }
      else {
        fetch_body['resource_booking'] = formData;       
      }
      if(this.props.is_edit){
        fetch(`${apiUrl}/${collection}?${params}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' },
          method: this.props.fetch_method,
          body: JSON.stringify(fetch_body)
        }).then(parseResponse).then(resp => {
          Materialize.toast('Reserva de recurso editado com sucesso.', 10000, 'green',function(){$('#toast-container').remove();});
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
        fetch(`${apiUrl}/${collection}?${params}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' },
          method: this.props.fetch_method,
          body: JSON.stringify(fetch_body)
        }).then(parseResponse).then(resp => {
          this.updateShift(Number(this.state.selected_shift));          
          Materialize.toast('Reserva de recurso criada com sucesso.', 10000, 'green',function(){$('#toast-container').remove();});
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

  updateShift(id){
    var fetch_body = {resource_shift: {borrowed:1}};

    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_shifts/${id}`;
    const params = `permission=${this.props.current_role.id}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'put',
      body: JSON.stringify(fetch_body)
    }).then(parseResponse).then(resp => {
    });
  }
  confirmButton() {
    return (
      <div className="card-action">
        <a className='back-bt waves-effect btn-flat' href='#' onClick={this.props.prev}> Voltar </a>
        <button className="waves-effect btn right button-color" onClick={this.handleSubmit.bind(this)} name="commit" type="submit">{this.props.is_edit ? 'Atualizar' : 'Criar'}</button>
        {/* <button className="waves-effect btn right button-color" onClick={this.testOutput.bind(this)} name="commit" type="submit">{this.props.is_edit ? 'Atualizar' : 'Criar'}</button> */}
      </div>
    );
  }

  buildBody(){
    var final_message = {};

    let shift = this.state.resource_shifts.find(rs => Number(this.state.selected_shift) === rs.id );

    final_message['citizen_id'] = Number(this.state.selected_citizen);
    final_message['resource_shift_id'] = Number(this.state.selected_shift);
    final_message['service_place_id'] = Number(this.state.current_service_place);
    final_message['booking_start_time'] = new Date(shift.execution_start_time);
    final_message['booking_end_time'] = new Date(shift.execution_end_time);
    
    final_message['booking_reason'] = this.state.resource_booking.booking_reason;
    final_message['status'] = 'Reservado';
    final_message['situation_id'] = 1;
    final_message['active'] = 1;
    return final_message;
  }

  formatCPF(cpf){
    return(
      `${cpf[0]}${cpf[1]}${cpf[2]}.${cpf[3]}${cpf[4]}${cpf[5]}.${cpf[6]}${cpf[7]}${cpf[8]}-${cpf[9]}${cpf[10]}`
    );
  }

  formatTime(time){
    let day_shift = strftime.timezone('+0000')('%d/%m/%Y', new Date(time));
    let time_shift = this.timeSizeFixer((new Date(time).getHours()).toString()) + ':' + this.timeSizeFixer((new Date(time).getMinutes()).toString());
    return(`${day_shift} - ${time_shift} h`);
  }

  pickShift(){
    if(this.state.resource_shifts){
      var resource_shifts = this.state.resource_shifts.sort(function(a,b) {return (a.execution_start_time > b.execution_start_time) ? 1 : ((b.execution_start_time > a.execution_start_time) ? -1 : 0);} );  
      const shiftList = (
        resource_shifts.map((rs) => {
          return (
            <option key={Math.random()} value={rs ? rs.id : 0}>
              {`[ #${rs.id} ] ${this.formatTime(new Date(rs.execution_start_time))}`} 
            </option>
          );
        })
      );
    
      return (
        <Input 
          name="selected_shift"   
          type='select' 
          value={this.state.selected_shift}
          onChange={
            (event) => {
              if(event.target.value != this.state.selected_professional) {
                this.handleInputResourceChange(event);
              }
            }
          }
        >
          <option value='0' disabled>Escolha um horário</option>
          {shiftList}
        </Input>
      );
    }
    return (
      <Input 
        name="selected_shift"   
        type='select' 
        value={this.state.selected_shift}
        onChange={
          (event) => {
            if(event.target.value != this.state.selected_professional) {
              this.handleInputResourceChange(event);
            }
          }
        }
      >
        <option value='0' disabled>Escolha um horário</option>
      </Input>
    );
  }

  pickStatus(){
    var available_status = ['Requisitado', 'Empréstimo concedido','Recusado', 'Emprestado', 'Devolvido com avarias' , 'Devolvido', 'Não Devolvido'];

    const statusList = (
      available_status.map((as) => {
        return (
          <option key={Math.random()} value={as}>
            {`${as}`} 
          </option>
        );
      })
    );
    return (
      <Input 
        name="status"   
        type='select' 
        value={this.state.status}
        onChange={
          (event) => {
            if(event.target.value != this.state.status) {
              console.log(event.target.value, this.state.status);
              this.handleInputResourceChange(event);
            }
          }
        }
      >
        {statusList}
      </Input>
    );
  
  }
  pickCitizen(){
    var citizens = this.state.citizens.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );  
    const citizensList = (
      citizens.map((c) => {
        return (
          <option key={Math.random()} value={c ? c.id : 0}>
            {`${c.name} (${this.formatCPF(c.cpf)})`} 
          </option>
        );
      })
    );
    return (
      <Input 
        name="selected_citizen"   
        type='select' 
        value={this.state.selected_citizen}
        onChange={
          (event) => {
            if(event.target.value != this.state.selected_professional) {
              this.handleInputResourceChange(event);
            }
          }
        }
      >
        <option value='0' disabled>Escolha o cidadão</option>
        {citizensList}
      </Input>
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
      var resource = this.state.resource.find(r => Number(this.state.resource_booking.resource_id)=== r.id );

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
          value={this.state.resource_booking.professional_responsible_id}
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
        value={this.state.resource_booking.professional_responsible_id}
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
          value={this.state.resource_booking.professional_responsible_id}
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
        value={this.state.resource_booking.professional_responsible_id}
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
    return({day: this.state.resource_booking.execution_start_time,begin_time:transfBegin_time,end_time:transfEnd_time});
  }
  renderFormCreate(){
    return(
      <Row className='first-line'>
        <Col s={12} m={12} l={12}>

          <div className="field-input" id='select-citizen'>
            <h6>Cidadão*:</h6>
            {this.pickCitizen()}
          </div>
      
          <div className="field-input" id="no-padding">
            <h6>Tipo de recurso*:</h6>
            {this.pickResourceType()}
          </div>

          <div className="field-input" id="no-padding">
            <h6>Recurso*:</h6>
            {this.pickResource()}
          </div>

          <div className="field-input" id='select-citizen'>
            <h6>Horário*:</h6>
            {this.pickShift()}
          </div>         

          <div id="field-textarea">
            <h6>Motivo da reserva:</h6>
            <label>
              <textarea  
                className='input-field materialize-textarea black-text'
                name="booking_reason" 
                placeholder="Explique o motivo para reservar este recurso"
                value={this.state.resource_booking.booking_reason} 
                onChange={this.handleInputResourceChange.bind(this)} 
              />
            </label>
          </div>
      
          <p><font color="red"> Campos com (*) são de preenchimento obrigatório.</font></p>
        </Col>
      </Row>);
  }
  renderFormEdit(){    
    console.log(this.props);
    console.log(this.state);
    return(
      <Row className='first-line'>
        <Col s={12} m={12} l={12}>
          <div>
            <h6><b>Horário inicial:</b></h6>
            {this.formatTime(this.props.data.booking_start_time)}
          </div> 
          <div>
            <h6><b>Horário final:</b></h6>
            {this.formatTime(this.props.data.booking_end_time)}
          </div> 
          <div>
            <h6><b>Motivo:</b></h6>
            {this.props.data.booking_reason}
          </div>
          <div>
            <h6><b>Tipo de recurso:</b></h6>
            {this.state.resource_bookings_details ? this.state.resource_bookings_details.resource_type_name : ''}
          </div> 
          <div>
            <h6><b>Recurso: </b></h6>
            {this.state.resource != '' ? this.formatResourceDisplay(this.state.resource) : ''}
          </div> 
          <div>
            <h6><b>Solicitante:</b></h6>
            {this.state.resource_bookings_details ? this.state.resource_bookings_details.citizen_name : ''}
          </div>  
          <div>
            <h6><b>Status Atual:</b></h6>
            {this.pickStatus()}
          </div>  
           
        </Col>
      </Row>
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
                  <h2 className="card-title">Alterar agendamento: {this.props.data.id}</h2> 
                  :
                  <h2 className="card-title">Novo agendamento</h2> 
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
