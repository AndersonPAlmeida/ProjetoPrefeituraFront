{/*
  * This file is part of Agendador.
  *
  * Agendador is free software: you can redistribute it and/or modify
  * it under the terms of the GNU General Public License as published by
  * the Free Software Foundation, either version 3 of the License, or
  * (at your option) any later version.
  *
  * Agendador is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  * GNU General Public License for more details.
  *
  * You should have received a copy of the GNU General Public License
  * along with Agendador.  If not, see <https://www.gnu.org/licenses/>.
  */}

import React, {Component} from 'react';
import { Link } from 'react-router';
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize';
import styles from './styles/ResourceShow.css';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';
import MapWithUserLocation from './MapWithUserLocation';

const nominatimURL = 'https://nominatim.openstreetmap.org/search?';

class getResourceShiftShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource_booking: {},
      current_permission: undefined,
      details:{},
      resource_type:{},
      service_place:{},
      resource:{},
      professional_name:''
    };
    this.resolveTime = this.resolveTime.bind(this);
    this.getLatLng = this.getLatLng.bind(this);

  }

  componentWillMount() {
    var current_role = this.props.user.current_role;
    var user_roles = this.props.user.roles;
    var current_permission = undefined;
    for (let i = 0; i < user_roles.length; i++){
      if (user_roles[i].id === current_role){
        current_permission = user_roles[i].role; 
        break;
      }
    }
    this.setState({current_permission: current_permission});
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_bookings/${this.props.params.resource_booking_id}`;
    const params = `permission=${this.props.user.current_role}&view=${this.props.user.current_role != 'citizen' ? 'professional' : 'citizen'}`;
    this.getExtraDetails();
    
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ resource_booking: resp });
      this.resolveTime(resp);
    });
  }
  
  getProfessionalNameResource(id) {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_shift_professional_responsible/${id}`;
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ professional_name_resource: resp.professional_name });
    });
  }

  getDetails(id) {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_details/${id}`;
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ service_place: resp.service_place }); 
      this.getLatLng(resp.service_place.address_street + ',' + resp.service_place.address_number +' ' + resp.service_place.neighborhood);
    });
  }

  getLatLng(street){
    var query = street.replace(/\s/g,'+');
    fetch(`${nominatimURL}q=${query}&format=json`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      this.setState({nominatimData: resp });
    }).catch(error => {
      console.log(error);
    });
  }

  getExtraDetails() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'resource_bookings_get_extra_info/';
    const params = `permission=${this.props.user.current_role}&view=${this.props.user.current_role != 'citizen' ? 'professional' : 'citizen'}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      let fetch_response = resp.find(r => r.resource_booking_id === Number(this.props.params.resource_booking_id));
      let resource = fetch_response.resource;
      this.getProfessionalNameResource(Number(resource.professional_responsible_id));
      this.getDetails(resource.id);
      self.setState({ 
        resource_bookings_details: fetch_response,
        resource: fetch_response.resource
      });
    });
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Informações da Reserva do Recurso: </h2>
          <Row>   
            <Col s={12} m={6} >
              <Card className='' title={'Recurso'} >
                <p> 
                  <b>Tipo do recurso: </b>
                  {this.state.resource_bookings_details ? this.state.resource_bookings_details.resource_type_name : ''}
                </p> 
                <p> 
                  <b>Marca: </b>
                  {this.state.resource.brand}
                </p>
                <p> 
                  <b>Modelo: </b>
                  {this.state.resource.model}
                </p>
                <p> 
                  <b>Etiqueta: </b>
                  {this.state.resource.label}
                </p>
                <p> 
                  <b>Nota: </b>
                  {this.state.resource.note}
                </p>     
                <p> 
                  <b>Profissional responsável: </b>
                  {this.state.professional_name_resource}
                </p>   
                <p> 
                  <b>Descrição do Recurso: </b>
                  {this.state.resource_bookings_details ? this.state.resource_bookings_details.resource_type_description : ''}
                </p> 
                <p> 
                  <b>Recurso Móvel: </b>
                  {this.state.resource_type.mobile == 'false' ? 'Não' : 'Sim' }
                </p> 
                <p> 
                  <b>Tempo mínimo da escala: </b>
                  {this.state.resource.minimum_schedule_time}
                  <span style={{marginLeft:3}}>h</span>
                </p>  
                <p> 
                  <b>Tempo máximo da escala: </b>
                  {this.state.resource.maximum_schedule_time}
                  <span style={{marginLeft:3}}>h</span>
                </p> 
                <p> 
                  <b>Situação: </b>
                  {this.state.resource.active ? 'Ativo' : 'Inativo'}
                </p>
              </Card>  
            </Col>         
            <Col s={12} m={6}>
              <Card className='' title={'Reserva do Recurso'}>
                <p>
                  <b>Cidadão solicitante: </b>
                  {this.state.resource_bookings_details ? this.state.resource_bookings_details.citizen_name : ''}
                </p>
                <p>
                  <b>Status: </b>
                  {this.state.resource_booking ? this.state.resource_booking.status : ''}
                </p>
                <p> 
                  <b>Data e dia inicial: </b>
                  {this.state.time_solved ? this.state.time_solved.day_start:''}    
                  <span style={{marginLeft:4, marginRight:4}}>-</span>
                  {this.state.time_solved ? this.state.time_solved.time_start:''}                      
                  <span style={{marginLeft:4}}>h</span>                        
                </p>  
                <p> 
                  <b>Data e dia final: </b>
                  {this.state.time_solved ? this.state.time_solved.day_end:''}    
                  <span style={{marginLeft:4, marginRight:4}}>-</span>
                  {this.state.time_solved ? this.state.time_solved.time_end:''}                      
                  <span style={{marginLeft:4}}>h</span>                                  
                </p> 
                
                <p>
                  <b>Motivo da reserva: </b>
                  {this.state.resource_booking ? this.state.resource_booking.booking_reason : ''}
                </p> 


                <p>
                  <b>Situação: </b>
                  {this.state.resource_booking.active == 1 ? 'Ativo' : 'Inativo'}                  
                </p> 
                <p>
                  <b></b>
                </p>
              </Card>  
            </Col>    
            <Col s={12} m={6}>
              <Card className='' title={'Local do Recurso'}>
                <p>
                  <b>Local do Recurso: </b>
                  {this.state.service_place.name}
                </p> 
                <p> 
                  <b>Endereço: </b>
                  {this.state.service_place.address_street}
                  <span style={{marginRight:4}}>,</span>
                  {this.state.service_place.address_number}                      
                </p>  
                <p> 
                  <b>Bairro: </b>
                  {this.state.service_place.neighborhood}                 
                </p> 
              </Card>              
            </Col>             
          </Row>   
          <Row>
            <Col s={12}>
              <MapWithUserLocation address={this.state.service_place.address_street} nominatimData={this.state.nominatimData}/>
            </Col>
          </Row> 
          <Row>
            <p><b>Nota:</b> A localização fornecida apenas indica onde a rua está e não a localização precisa do recurso</p>
          </Row>
        </div>
        {this.editButton()}
      </div>
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
  resolveTime(booking){
    // Start time
    let day_start = strftime.timezone('+0000')('%d/%m/%Y', new Date(booking.booking_start_time));
    let hour_start = new Date(booking.booking_start_time).getHours().toString();
    let minute_start = new Date(booking.booking_start_time).getMinutes().toString();
    let time_start = this.timeSizeFixer(hour_start) + ':' + this.timeSizeFixer(minute_start);
    
    // End time
    let day_end = strftime.timezone('+0000')('%d/%m/%Y', new Date(booking.booking_end_time));      
    let hour_end = new Date(booking.booking_end_time).getHours().toString();
    let minute_end = new Date(booking.booking_end_time).getMinutes().toString();
    let time_end = this.timeSizeFixer(hour_end) + ':' + this.timeSizeFixer(minute_end);
    
    this.setState({time_solved:{day_start: day_start, time_start: time_start, day_end: day_end, time_end: time_end}});
  }
  editResource () {
    browserHistory.push(`resource_bookings/${this.props.params.resource_booking_id}/edit`);
  }

  prev() {
    browserHistory.push('resource_bookings');
  }  

  editButton() {
    if(this.state.current_permission)
      return (
        <div className="card-action">
          <a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
          <button id={'editResource'} className="waves-effect btn right" name="commit" onClick={this.editResource.bind(this)} type="submit">Editar</button>
        </div>
      );
    else
      return (
        <div className="card-action">
          <a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
        </div>
      );

  }

  render() {
    return (
      <main>
        <Row>
          <Col s={12}>
            <div>
              {this.mainComponent()}
            </div>
          </Col>
        </Row>
      </main>
    );
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo']);
  return {
    user
  };
};
const ResourceShiftShow = connect(
  mapStateToProps
)(getResourceShiftShow);
export default ResourceShiftShow;
