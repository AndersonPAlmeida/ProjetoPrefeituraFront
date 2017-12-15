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

class getResourceShiftShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource_booking: {
        active:undefined,
        borrowed:undefined,
        created_at:undefined,
        execution_end_time:undefined,
        execution_start_time:undefined,
        id:undefined,
        next_shift_id:undefined,
        notes:undefined,
        professional_responsible_id:undefined,
        resource_id:undefined,
        updated_at:undefined
      },
      current_permission: undefined,
      details:{},
      resource_type:{},
      service_place:{},
      resource:{},
      time_solved:{},
      professional_name:''
    };
    this.getDetails = this.getDetails.bind(this);
    this.resolveTime = this.resolveTime.bind(this);

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
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_bookings/${this.props.params.resource_booking_id}`;
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ resource_booking: resp });
      this.getDetails(resp.resource_id);
      this.getProfessionalName(resp.professional_responsible_id);
      this.resolveTime(resp);
    });
  }
  getDetails(id) {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_details/${id}`;
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ details: resp });
      self.setState({ resource: resp.resource });
      self.setState({ resource_type: resp.resource_type });
      self.setState({ service_place: resp.service_place });
    });
  }
  getProfessionalName(id) {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_booking_professional_responsible/${id}`;
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ professional_name: resp.professional_name });
    });
  }
  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Informações da Escala do Recurso: </h2>
          <Row>   
            <Col s={12} m={6} >
              <Card className='' title={'Recurso'} >
                <p> 
                  <b>Tipo do recurso: </b>
                  {this.state.resource_type.name}
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
                  {this.state.details.professional_name}
                </p>   
                <p> 
                  <b>Descrição do Recurso: </b>
                  {this.state.resource_type.description}
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
              <Card className='' title={'Escala do Recurso'}>
                <p> 
                  <b>Data e dia inicial: </b>
                  {this.state.time_solved.day_start}
                  <span style={{marginLeft:4, marginRight:4}}>-</span>
                  {this.state.time_solved.time_start}
                  <span style={{marginLeft:4}}>h</span>                                    
                </p>  
                <p> 
                  <b>Data e dia final: </b>
                  {this.state.time_solved.day_end}
                  <span style={{marginLeft:4, marginRight:4}}>-</span>
                  {this.state.time_solved.time_end}
                  <span style={{marginLeft:4}}>h</span>                                    
                </p> 
                <p>
                  <b>Emprestado: </b>
                  {this.state.resource_booking.borrowed==0 ? 'Não' : 'Sim' }
                </p> 
                <p>
                  <b>Profissional responsável pela escala: </b>
                  {this.state.professional_name}
                </p> 
                <p>
                  <b>Situação: </b>
                  {this.state.resource_booking.active==0 ? 'Inativo' : 'Ativo' }
                </p> 
                <p>
                  <b>Anotação: </b>
                  {this.state.resource_booking.notes}
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
  resolveTime(shift){
    // Start time
    let day_start = strftime.timezone('+0000')('%d/%m/%Y', new Date(shift.execution_start_time));
    let hour_start = new Date(shift.execution_start_time).getHours().toString();
    let minute_start = new Date(shift.execution_start_time).getMinutes().toString();
    let time_start = this.timeSizeFixer(hour_start) + ':' + this.timeSizeFixer(minute_start);
    
    // End time
    let day_end = strftime.timezone('+0000')('%d/%m/%Y', new Date(shift.execution_end_time));      
    let hour_end = new Date(shift.execution_end_time).getHours().toString();
    let minute_end = new Date(shift.execution_end_time).getMinutes().toString();
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
    return (
      <div className="card-action">
        <a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
        <button id={'editResource'} className="waves-effect btn right" name="commit" onClick={this.editResource.bind(this)} type="submit">Editar</button>
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
