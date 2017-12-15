import React, {Component} from 'react';
import { Link } from 'react-router';
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize';
import styles from './styles/ResourceList.css';
import 'react-day-picker/lib/style.css';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';

class getResourceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource_shifts:[],
      filter_label: '',
      filter_end_date: '',
      filter_start_date: '',
      last_fetch_label: '',
      last_fetch_end_date: '',
      last_fetch_start_date: '',
      filter_s: '',
      city_hall:[],
      resources_with_details:[],
      resources: [],
      resource_types:[],
      service_places:[],
      current_permission: ''
    };
    this.getCityHallName = this.getCityHallName.bind(this);      
    this.getResourceWithDetails = this.getResourceWithDetails.bind(this);      
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
    const collection = 'resource_shifts';
    const params = `permission=${this.props.user.current_role}`;
    this.getResourceWithDetails();

    if(current_permission == 'adm_c3sl'){
      this.getCityHallName();   
    }

    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ resource_shifts: resp });    
    });
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Escala de Recurso </h2>
          {this.filterResourceType()}
          {this.tableList()}
        </div>
        <div className="card-action">
          {this.newResourceTypeButton()}
        </div>
      </div>
    );
  }

  getResourceWithDetails() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'resource_more_info/';
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ 
        resources_with_details: resp, 
        service_places:resp.service_place, 
        resource_types:resp.resource_type, 
        resources:resp.resource
      });
    });
  }
  getCityHallName() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'city_halls/';
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ city_hall: resp });
    });
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

  resolveTimeReminder(shift){
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
    
    return ({day_start: day_start, time_start: time_start, day_end: day_end, time_end: time_end});
  }
  resource_solver(id){
    let resource_in_use = this.state.resources.find(r => id === r.id );
    if (!resource_in_use)
      return null;
    let resource_type_in_use = this.state.resource_types.find(r => resource_in_use.resource_types_id === r.id );
    let service_place_in_use = this.state.service_places.find(sp => resource_in_use.service_place_id === sp.id );

    return ({resource: resource_in_use,
      resource_type:resource_type_in_use,
      service_place:service_place_in_use
    });
  }


  tableList() {
    const data = (
      this.state.resource_shifts.map((resource_shift) => {
        let timer = this.resolveTimeReminder(resource_shift);
        let resource_data = this.resource_solver(resource_shift.resource_id);
        if (resource_data == null){
          return;
        }
        return (
          <tr>
            <td key={Math.random()} >
              {resource_shift.id}
            </td> 

            <td key={Math.random()} >
              {resource_data.resource_type.name}
            </td>

            <td key={Math.random()} >
              {resource_data.resource.label}
            </td>
            
            <td key={Math.random()} >
              {resource_shift.borrowed == 0 ? 'Não' : 'Sim'}
            </td>    

            <td key={Math.random()} >
              {timer.day_start}
            </td>      
            <td key={Math.random()} >
              {timer.time_start}
            </td>   

            <td key={Math.random()} >
              {timer.day_end}
            </td>      
            <td key={Math.random()} >
              {timer.time_end}
            </td>     
                
            <td key={Math.random()} >
              {resource_shift.notes}
            </td> 

            <td key={Math.random()} >
              {resource_data.service_place.name}
            </td> 
            
            <td key={Math.random()} >
              {resource_shift.active == 0 ? 'Inativo' : 'Ativo'}
            </td> 

            <td key={Math.random()} >
              <a className='back-bt waves-effect btn-flat' 
                id="iconTable"
                href='#' 
                onClick={ () => 
                  browserHistory.push(`/resource_shifts/${resource_shift.id}/edit`) 
                }>
                <i className="waves-effect material-icons tooltipped">
                    edit
                </i>
              </a>

              <a className='back-bt waves-effect btn-flat' 
                id="iconTable"
                href='#' 
                onClick={ () => 
                  browserHistory.push(`/resource_shifts/${resource_shift.id}`) 
                }>
                <i className="waves-effect material-icons tooltipped">
                    visibility
                </i>
              </a>
            </td>
          </tr>
        );
      })
    );

    // Fields to show in the table, and what object properties in the data they bind to
    const fields = (
      <tr>
        
        <th>Escala #</th>

        <th>Tipo do recurso</th>

        <th>Etiqueta do recurso</th>

        <th>Emprestado</th>

        <th>Dia inicial de execução</th>
        <th>Horário inicial de execução</th>

        <th>Dia final de execução</th>
        <th>Horário final de execução</th>
                
        <th>Notas</th>

        <th>Local do recurso</th>
        
        <th>Ativo</th>

        <th></th>

      </tr>
    );

    return (
      <div className={'table-size'}>
        <table className={ styles['table-list']}>
          <thead>
            {fields}
          </thead>
          <tbody>
            {data}
          </tbody>
        </table>
      </div>
    );
  }

  handleInputFilterChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  filterResourceType() {
    return (
      <Row>
        <Col s={12} m={6}>
          <div >
            <h6>Dia Inicial:</h6>
            <label>
              <input
                type="date"
                name="filter_start_date"
                value={this.state.filter_start_date}
                onChange={this.handleInputFilterChange.bind(this)}
              />
            </label>
          </div>
        </Col>
        <Col s={12} m={6}>
          <div>
            <h6>Data Final:</h6>
            <label>
              <input
                type="date"
                name="filter_end_date"
                value={this.state.filter_end_date}
                onChange={this.handleInputFilterChange.bind(this)}
              />
            </label>
          </div>
        </Col>      
        <div>
          <button 
            id="filterBtn"
            className="waves-effect btn right button-color" 
            onClick={this.handleFilterSubmit.bind(this,false)} 
            name="commit" 
            type="submit">
              FILTRAR
          </button>
        </div>        
      </Row>
    );
  }

  handleFilterSubmit(sort_only) {
    var end_date;
    var start_date;
    if(sort_only) {
      end_date = this.state.last_fetch_end_date;
      start_date = this.state.last_fetch_start_date; 
    } else {
      end_date = this.state.filter_end_date;
      start_date = this.state.filter_start_date;
    }
    start_date = start_date.replace(/\s/g,'+');
    end_date = end_date.replace(/\s/g,'+');
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'resource_shifts';
    const params = `permission=${this.props.user.current_role}&q[execution_start_time]=${start_date}&q[execution_end_time]=${end_date}&q[s]=${this.state.filter_s}`;

    console.log(`${apiUrl}/${collection}?${params}`);
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      this.setState({
        resources: resp,
        last_fetch_start_date: start_date,
        last_fetch_end_date: end_date
      });
    });
  }

  newResourceTypeButton() {
    return (
      <button 
        onClick={() =>
          browserHistory.push({ pathname: '/resource_shifts/new'}) 
        }
        className="btn waves-effect btn button-color" 
        name="anterior" 
        type="submit">
          CADASTRAR ESCALA DE RECURSO
      </button>
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

const ResourceList = connect(
  mapStateToProps
)(getResourceList);
export default ResourceList;
