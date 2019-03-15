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
import { Button, Card, Row, Col, Input, Collection, CollectionItem } from 'react-materialize';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';


class getResourceBookingCitizen extends Component {
  constructor(props) {
    super(props);
    this.state={
      resource_shifts:[],
      grouped_by_resource:[],
      resource_details:[],
      selected_resource_type:'',
      selected_resource:'',
      selected_time:'',
      booking_reason:'',
    };
    this.handleClick = this.handleClick.bind(this);
  }

  prev() {
    browserHistory.push('/resource_bookings');
  }
  componentWillMount(){
    this.getShift();
  }
  getShift() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'resource_shifts/';
    const params = 'permission=citizen';
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      this.groupResources(resp);
      self.setState({
        resource_shifts:resp
      });
    });
  }
  getResourceDetails(id) {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_details/${id}`;
    const params = 'permission=citizen';
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      let details = this.state.resource_details;
      details.push(resp);
      self.setState({
        resource_details:details
      });
    });
  }

  groupResources(resources){
    let res = resources.sort(function(a,b){return (a.resource_id > b.resource_id) ? 1 : ((b.resource_id > a.resource_id) ? -1 : 0);} );
    var resourceList = [];
    var biggestNumber = res[res.length-1].resource_id; // The biggest resource_id
    for (let i = 1; i <= biggestNumber; i++){
      let aux = res.filter((x) => { return x.resource_id == i; });
      if(aux.length > 0){
        this.getResourceDetails(aux[0].resource_id);
        resourceList.push({resource_id: aux[0].resource_id, shifts:aux});
      }
    }
    this.setState({grouped_by_resource: resourceList});
  }

  buildBody(){
    var final_message = {};

    let shift = this.state.resource_shifts.find(rs => Number(this.state.selected_time) === rs.id );
    let resource_id = Number(shift.resource_id);

    let resource = this.state.resource_details.find(rd => resource_id === rd.resource.id );

    final_message['citizen_id'] = Number(this.props.current_citizen.id);
    final_message['resource_shift_id'] = Number(this.state.selected_time);


    final_message['service_place_id'] = Number(resource.service_place.id);
    final_message['booking_start_time'] = new Date(shift.execution_start_time);
    final_message['booking_end_time'] = new Date(shift.execution_end_time);

    final_message['booking_reason'] = this.state.booking_reason;
    final_message['status'] = 'Em Análise';
    final_message['situation_id'] = 1;
    // final_message['active'] = 1;

    return final_message;
  }

  removeDuplicates(array){
    let res = array.sort(function(a,b){return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);} );
    let listOfIndex = [];

    for(let i = 0 ; i < res.length; i++){
      if (i + 1 < res.length){
        if(res[i].id == res[i+1].id){
          listOfIndex.push(i);
        }
      }
    }
    for(let i = 0; i < listOfIndex.length; i++){
      if (listOfIndex.reverse()[i] > -1) {
        res.splice(listOfIndex.reverse()[i], 1);
        listOfIndex.pop();
      }
    }
    return res;
  }

  setIDResourceString(resource){
    let final_name;
    if(resource){
      if(resource.label.length > 0){
        if (resource.brand.length > 0){
          if (resource.model.length > 0){
            final_name = `[${resource.brand}] ${resource.model} (${resource.label})`;
          }
          else{
            final_name = `${resource.brand} - ${resource.label}`;
          }
        }
        else{
          final_name = `${resource.label}`;
        }
      }
      else{
        final_name =`ID do recurso: ${resource.id}`;
      }
    }
    else{
      final_name = 'Não existe recurso deste tipo';
    }
    return final_name;
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

  transformTime(shift, option){
    var time = shift[option];
    var transformedTime;
    transformedTime = strftime.timezone('+0000')('%d/%m/%Y', new Date(time))
      + ' - '
      + this.timeSizeFixer((new Date(time).getHours()).toString())
      + ':'
      + this.timeSizeFixer((new Date(time).getMinutes()).toString());

    return (transformedTime);
  }

  getShiftsFromResource(id){
    let resources_grouped = this.state.grouped_by_resource;
    var shifts = [];
    for (let i = 0; i < resources_grouped.length; i++){
      if (resources_grouped[i].resource_id == Number(id)){
        shifts = resources_grouped[i].shifts;
      }
    }
    var finalShifts = [];
    for(let i = 0; i < shifts.length; i++){
      if(shifts[i].borrowed == 0 && shifts[i].active == 1)
        finalShifts.push({id: shifts[i].id ,time:`[${this.transformTime(shifts[i], 'execution_start_time')}] - [${this.transformTime(shifts[i], 'execution_end_time')}]`});
    }
    return finalShifts;
  }

  handleInputResourceChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if(name == 'selected_resource')
      this.getShiftsFromResource(value);

    this.setState({[name]: value});
  }

  updateShift(id){
    var fetch_body = {resource_shift: {borrowed:1}};

    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_shifts/${id}`;
    const params = 'permission=citizen';
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'put',
      body: JSON.stringify(fetch_body)
    }).then(parseResponse).then(resp => {
    });
  }

  handleClick() {
    let errors = [];
    let formData = {};
    formData = this.buildBody();
    console.log("Reason",this.state.booking_reason)
    if(!this.state.booking_reason){
        errors.push("Motivo está vazio");
    }
    if(errors.length > 0) {
      let full_error_msg = '';
      errors.forEach(function(elem){ full_error_msg += elem + '\n'; });
      Materialize.toast(full_error_msg, 10000, 'red',function(){$('#toast-container').remove();});
    } else {
      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
      const collection = this.props.fetch_collection;
      const params = this.props.fetch_params;
      let fetch_body = {};
      fetch_body = formData;
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json' },
        method: this.props.fetch_method,
        body: JSON.stringify(fetch_body)
      }).then(parseResponse).then(resp => {
        this.updateShift(Number(this.state.selected_time));
        Materialize.toast('Reserva de recurso criada com sucesso.', 10000, 'green',function(){$('#toast-container').remove();});
        browserHistory.push(this.props.submit_url);
      }).catch(({errors}) => {
        if(errors) {
          let full_error_msg = '';
          errors['full_messages'].forEach(function(elem){ full_error_msg += elem + '\n'; });
          Materialize.toast(full_error_msg, 10000, 'red',function(){$('#toast-container').remove();});
          throw errors;
        }
        else{
          this.updateShift(Number(this.state.selected_time));
          Materialize.toast('Reserva de recurso criada com sucesso.', 10000, 'green',function(){$('#toast-container').remove();});
        }
      });
    }
  }

  pickResourceType(){
    if(this.state.resource_details){
      var resourceTypeList = [];
      for(let i = 0; i < this.state.resource_details.length; i++){
        let aux = this.state.resource_details[i]['resource_type'];
        resourceTypeList.push({id: aux.id, name: aux.name});
      }
      resourceTypeList = this.removeDuplicates(resourceTypeList);
    }

    const typeList = (
      resourceTypeList.map((rt) => {
        return (
          <option key={Math.random()} value={rt ? rt.id : 0}>
            {`${rt.name}`}
          </option>
        );
      })
    );

    return (
      <Input
        name="selected_resource_type"
        type='select'
        value={this.state.selected_resource_type}
        onChange={
          (event) => {
            if(event.target.value != this.state.selected_resource_type) {
              this.handleInputResourceChange(event);
            }
          }
        }
      >
        <option value='0' disabled>Escolha um tipo de recurso</option>
        {typeList}
      </Input>
    );
  }

  pickResource(){
    if(this.state.resource_details){
      var resourceList = [];
      for(let i = 0; i < this.state.resource_details.length; i++){
        let aux = this.state.resource_details[i]['resource'];
        let aux2 = this.state.resource_details[i]['resource_type'];
        let final_name = this.setIDResourceString(aux);
        if(this.state.selected_resource_type == aux2.id)
          resourceList.push({id: aux.id, name: final_name});
      }
      resourceList = this.removeDuplicates(resourceList);
    }

    const resList = (
      resourceList.map((rt) => {
        return (
          <option key={Math.random()} value={rt ? rt.id : 0}>
            {`${rt.name}`}
          </option>
        );
      })
    );
    return (
      <Input
        name="selected_resource"
        type='select'
        value={this.state.selected_resource}
        onChange={
          (event) => {
            if(event.target.value != this.state.selected_resource) {
              this.handleInputResourceChange(event);
            }
          }
        }
      >
        <option value='0' disabled>Escolha um recurso</option>
        {resList}
      </Input>
    );
  }

  pickTime(){

    var timeList = this.getShiftsFromResource(this.state.selected_resource);

    const resList = (
      timeList.map((rt) => {
        return (
          <option key={Math.random()} value={rt ? rt.id : 0}>
            {`${rt.time}`}
          </option>
        );
      })
    );
    return (
      <Input
        name="selected_time"
        type='select'
        value={this.state.selected_time}
        onChange={
          (event) => {
            if(event.target.value != this.state.selected_time) {
              this.handleInputResourceChange(event);
            }
          }
        }
      >
        <option value='0' disabled>Escolha um horário</option>
        {resList}
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
                <h2 className="card-title">Nova solicitação de recurso</h2>

                <Row>
                  <Col s={12} l={6}>
                    <div id='select-resource-booking-cit'>
                      <h6>1. Tipo de recurso*:</h6>
                      {this.pickResourceType()}
                    </div>
                  </Col>
                  <Col s={12} l={6}>
                    <div  id='select-resource-booking-cit'>
                      <h6>2. Recurso*:</h6>
                      {this.pickResource()}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col s={12} l={6}>
                    <div id='select-resource-booking-cit'>
                      <h6 id='padding-to-textarea'>3. Horário*:</h6>
                      {this.pickTime()}
                    </div>
                  </Col>

                  <Col s={12} l={6}>
                    <div id="text-area-size">
                      <h6>4. Motivo da reserva*:</h6>
                      <label>
                        <textarea
                          className='input-field materialize-textarea black-text'
                          name="booking_reason"
                          placeholder="Explique o motivo para reservar este recurso"
                          value={this.state.booking_reason}
                          onChange={this.handleInputResourceChange.bind(this)}
                        />
                      </label>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col l={2} offset={'l9'}>
                    <button className="waves-effect btn right button-color" onClick={this.handleClick.bind(this)} name="commit" type="submit">Solicitar</button>
                  </Col>
                </Row>
              </div>
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
const ResourceBookingCitizen = connect(
  mapStateToProps
)(getResourceBookingCitizen);
export default ResourceBookingCitizen;
