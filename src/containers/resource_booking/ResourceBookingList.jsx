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
import styles from './styles/ResourceList.css';
import 'react-day-picker/lib/style.css';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';
import { DatePicker } from '../components/AgendadorComponents'

// {
//   "id":3,
//   "active":1,
//   "booking_end_time":"2018-01-20T12:45:48.469-02:00",
//   "booking_reason":"Quero usar muito este recurso",
//   "booking_start_time":"2018-01-20T12:45:48.469-02:00",
//   "citizen_id":1,
//   "resource_booking_id":1,
//   "service_place_id":1,
//   "situation_id":1,
//   "status":"Em análise",

//   "updated_at":"2017-12-15T14:10:51.613-02:00",
//   "created_at":"2017-12-15T14:10:51.613-02:00",
// }

class getResourceList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      resource_bookings:[],
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
      current_permission: '',
      resource_bookings_details:[]
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
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'resource_bookings';
    const params = `permission=${this.props.user.current_role}&view=${this.props.user.current_role != 'citizen' ? 'professional' : 'citizen'}`;

    this.getResourceWithDetails();
    this.getExtraDetails();

    if(current_permission == 'adm_c3sl'){
      this.getCityHallName();
    }

    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ resource_bookings: resp });
    });
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Agendamento de Recurso </h2>
          {this.filterResourceBooking()}
          {this.tableList()}
        </div>
        <div className="card-action">
          {this.newResourceBookingButton()}
        </div>
      </div>
    );
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
      self.setState({
        resource_bookings_details: resp,
      });
    }).catch(error =>{
      console.log(error);
    });
  }

  getResourceWithDetails() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
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
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
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

  resolveTimeReminder(booking){
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
    if(this.props.user.current_role != 'citizen)'){
      var role = this.props.user.current_role;
      var permissionInfo = this.props.user.roles.find(r => role === r.id);
    }
    const data = (
      this.state.resource_bookings.map((resource_booking) => {
        let timer = this.resolveTimeReminder(resource_booking);
        let resource_extra_info = this.state.resource_bookings_details.find(rbd => resource_booking.id === rbd.resource_booking_id);
        return (
          <tr>
            <td key={Math.random()} >
              {resource_booking.id}
            </td>

            <td key={Math.random()} >
              {resource_extra_info ? resource_extra_info.resource_type_name : ''}
            </td>

            <td key={Math.random()} >
              {resource_extra_info ? resource_extra_info.citizen_name : ''}
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
              {resource_booking.active == 0 ? 'Inativo' : 'Ativo'}
            </td>
            <td key={Math.random()} >
              {resource_booking.status}
            </td>

            <td key={Math.random()} >
              {this.props.user.current_role != 'citizen' && (permissionInfo.role == 'adm_c3sl'||  permissionInfo.role == 'adm_prefeitura' || permissionInfo.role == 'adm_local')?
                <a className='back-bt waves-effect btn-flat'
                  id="iconTable"
                  href='#'
                  onClick={ () =>
                    browserHistory.push(`/resource_bookings/${resource_booking.id}/edit`)
                  }>
                  <i className="waves-effect material-icons tooltipped">
                      edit
                  </i>
                </a>
                :
                <a/>
              }

              <a className='back-bt waves-effect btn-flat'
                id="iconTable"
                href='#'
                onClick={ () =>
                  browserHistory.push(`/resource_bookings/${resource_booking.id}`)
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
        <th># Reserva</th>

        <th>Tipo de Recurso</th>

        <th>Cidadão</th>

        <th>
          <a
            href='#'
            className="grey-text text-darken-3 "
            onClick={
              () => {
                if (this.state.filter_s == 'day_start+asc'){
                  document.getElementById('ascDayStartIcon').style.display = 'none';
                  document.getElementById('descDayStartIcon').style.display = 'inline-block';
                }
                else{
                  document.getElementById('descDayStartIcon').style.display = 'none';
                  document.getElementById('ascDayStartIcon').style.display = 'inline-block';
                }

                this.setState({
                  ['filter_s']: this.state.filter_s == 'day_start+asc' ? 'day_start+desc' : 'day_start+asc'
                }, this.sortItems.bind(this,'day_start',this.state.filter_s));
              }
            }
          >
            Dia inicial de execução
            <i className="waves-effect material-icons tiny tooltipped" id="ascDayStartIcon" style={{display:'none'}}>
              arrow_drop_down
            </i>
            <i className="waves-effect material-icons tiny tooltipped" id="descDayStartIcon" style={{display:'none'}}>
              arrow_drop_up
            </i>
          </a>
        </th>
        <th>Horário inicial de execução</th>

        <th>
          <a
            href='#'
            className="grey-text text-darken-3 "
            onClick={
              () => {
                if (this.state.filter_s == 'day_end+asc'){
                  document.getElementById('ascDayEndIcon').style.display = 'none';
                  document.getElementById('descDayEndIcon').style.display = 'inline-block';
                }
                else{
                  document.getElementById('descDayEndIcon').style.display = 'none';
                  document.getElementById('ascDayEndIcon').style.display = 'inline-block';
                }

                this.setState({
                  ['filter_s']: this.state.filter_s == 'day_end+asc' ? 'day_end+desc' : 'day_end+asc'
                }, this.sortItems.bind(this,'day_end',this.state.filter_s));
              }
            }
          >
            Dia final de execução
            <i className="waves-effect material-icons tiny tooltipped" id="ascDayEndIcon" style={{display:'none'}}>
              arrow_drop_down
            </i>
            <i className="waves-effect material-icons tiny tooltipped" id="descDayEndIcon" style={{display:'none'}}>
              arrow_drop_up
            </i>
          </a>
        </th>
        <th>Horário final de execução</th>

        <th>Ativo</th>

        <th>
          <a
            href='#'
            className="grey-text text-darken-3 "
            onClick={
              () => {
                if (this.state.filter_s == 'day_end+asc'){
                  document.getElementById('ascDayEndIcon').style.display = 'none';
                  document.getElementById('descDayEndIcon').style.display = 'inline-block';
                }
                else{
                  document.getElementById('descDayEndIcon').style.display = 'none';
                  document.getElementById('ascDayEndIcon').style.display = 'inline-block';
                }

                this.setState({
                  ['filter_s']: this.state.filter_s == 'day_end+asc' ? 'day_end+desc' : 'day_end+asc'
                }, this.sortItems.bind(this,'day_end',this.state.filter_s));
              }
            }
          >
            Status
            <i className="waves-effect material-icons tiny tooltipped" id="ascDayEndIcon" style={{display:'none'}}>
              arrow_drop_down
            </i>
            <i className="waves-effect material-icons tiny tooltipped" id="descDayEndIcon" style={{display:'none'}}>
              arrow_drop_up
            </i>
          </a>
        </th>

        <th></th>

      </tr>
    );

    return (
      <div>
        <h5 className='title-color'>Agendamentos Realizados</h5>
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
      </div>
    );
  }

  sortItems(parameter, order){
    var items = this.state.resource_bookings;
    var newItems = [];
    switch(parameter){
    case 'day_start':
      newItems = items.sort(function(a,b){return (a.booking_start_time > b.booking_start_time) ? 1 : ((b.booking_start_time > a.booking_start_time) ? -1 : 0);} );
      if(order=='day_start+asc'){
        newItems = newItems.reverse();
      }
      break;
    case 'day_end':
      newItems = items.sort(function(a,b){return (a.booking_end_time > b.booking_end_time) ? 1 : ((b.booking_end_time > a.booking_end_time) ? -1 : 0);} );
      if(order=='day_end+asc'){
        newItems = newItems.reverse();
      }
      break;
    case 'status':
      newItems = items.sort(function(a,b){return (a.status > b.status) ? 1 : ((b.status > a.status) ? -1 : 0);} );
      if(order=='status+asc'){
        newItems = newItems.reverse();
      }
    }
    this.setState({resource_bookings: newItems});
  }

  handleInputFilterChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  filterResourceBooking() {
    return (
      <Row>
        <Col s={12} m={3}>
          <div >
            <h6>Dia Inicial:</h6>
            <label>
              <DatePicker
                name="filter_start_date"
                format = 'yyyy/mm/dd'
                value={this.state.filter_start_date}
                onChange={this.handleInputFilterChange.bind(this)}
              />
            </label>
          </div>
        </Col>
        <Col s={12} m={3}>
          <div>
            <h6>Data Final:</h6>
            <label>
              <DatePicker
                name="filter_end_date"
                format = 'yyyy/mm/dd'
                value={this.state.filter_end_date}
                onChange={this.handleInputFilterChange.bind(this)}
              />
            </label>
          </div>
        </Col>
        <Col s={12}>
            <button
              id="filterBtn"
              className="waves-effect btn button-color"
              onClick={this.handleFilterSubmit.bind(this,false)}
              name="commit"
              type="submit">
              FILTRAR
            </button>
            <div id='createResourceBookingButton'>
              {this.newResourceBookingButton()}
            </div>

        </Col>
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
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'resource_bookings';
    const params = `permission=${this.props.user.current_role}&view=${this.state.current_permission ? 'professional':'citizen'}&q[booking_start_time]=${start_date}&q[booking_end_time]=${end_date}&q[s]=${this.state.filter_s}`;

    console.log(`${apiUrl}/${collection}?${params}`);
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      this.setState({
        resource_bookings: resp,
        last_fetch_start_date: start_date,
        last_fetch_end_date: end_date
      });
    });
  }

  newResourceBookingButton() {
    return (
      <button
        onClick={() =>
          browserHistory.push({ pathname: '/resource_bookings/new'})
        }
        className="btn waves-effect btn button-color"
        name="anterior"
        type="submit">
          NOVO AGENDAMENTO
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
