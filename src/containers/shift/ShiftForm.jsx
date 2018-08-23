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

import React, {Component} from 'react'
import { connect } from 'react-redux'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import DayPicker, {DateUtils } from 'react-day-picker'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import update from 'react-addons-update';
import { Button, Card, Row, Col, Dropdown, Input, CardPanel } from 'react-materialize'
import styles from './styles/ShiftForm.css'
import { browserHistory } from 'react-router';


const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const WEEKDAYS_LONG = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const WEEKDAYS_SHORT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];


class getShiftForm extends Component {

  constructor(props) {
    super(props)
    var today = new Date();
    this.state = {
      city_halls: [],
      forms: [],
      shift: {
        city_hall_id: 0,
        execution_end_time: '',
        execution_start_time: '',
        id: 0,
        notes: '',
        professional_performer_name: '',
        professional_responsible_name: '',
        schedules: [],
        service_amount: 0,
        service_place_name: '',
        service_type_description:'',
        professional_performer_id: 0,
        service_type_id: 0,
        service_amount: 0,
        service_place_id: 0
      },
      aux: {
        selected_service_place: 0,
        selected_professional: 0,
        selected_service_type: 0,
        selected_city_hall: 0,
        filtered_service_places: [],
        filtered_professionals: [],
        filtered_service_types: [],
        end_year_id: '',
        start_year_id: '',
        start_year: '',
        end_year: '',
        start_month : '',
        end_month: '',
        start_day: '',
        end_day: '',
        start_hour: 0,
        start_min: 0,
        end_hour: 0,
        end_min: 0,
        remaining_text: 140
      },
      input_content:{
        isTimeDivision: 'number_schedules',
        number_schedules: 0,
        duration_schedule_min: 10
      },
      start_month: today,
      disabled_days: [today, { after: today, before: today }],
      selected_days: []
    };
    this.handleHourChange = this.handleHourChange.bind(this);
    this.handleTextInputChange = this.handleTextInputChange.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkErrors = this.checkErrors.bind(this);
    this.generateBody = this.generateBody.bind(this);
    this.handleDateInputChange = this.handleDateInputChange.bind(this);
    this.handleInputDivisonChange = this.handleInputDivisonChange.bind(this);
  }

  filter_input_lists(filter_location_id, data = null){
    let filtered_professionals_list = [];
    let filtered_types_list = [];

    if(data == null){
      data = this.state;
    }

    for(let i = 0; i < data.forms.professionals.length; ++i){
      for(let j = 0; j < data.forms.professionals[i].service_place_ids.length; ++j){
        if(Number(data.forms.professionals[i].service_place_ids[j]) === Number(filter_location_id)){
          filtered_professionals_list.push(data.forms.professionals[i]);
        }
      }
    }
    for(let i = 0; i < data.forms.service_types.length; ++i){
      for(let j = 0; j < data.forms.service_types[i].service_place_ids.length; ++j){
        if(Number(data.forms.service_types[i].service_place_ids[j]) === Number(filter_location_id)){
          filtered_types_list.push(data.forms.service_types[i]);
        }
      }
    }

    return {'filtered_professionals': filtered_professionals_list,
      'filtered_service_types': filtered_types_list};
  }

  componentDidMount() {
      var self = this;
      var data = this.props.is_edit ? this.props.data : this.state.shift

      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;

      var collection = 'forms/create_shift';

      const params = this.props.fetch_params;

      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json" },
            method: "get",
        }).then(parseResponse).then(resp => {
              let tempState = this.state;
              tempState = update(tempState, {
                forms: {$set: resp}
              });

              if(this.props.current_role.role !== 'adm_c3sl'){
                tempState = update(tempState, {
                    aux: {
                      ['filtered_service_places']:  {$set: tempState.forms.service_places}
                    }
                });
              }

              if(this.props.is_edit){

                tempState =  update(tempState, {
                  shift: {
                    ['execution_end_time'] : {$set : data.execution_end_time},
                    ['execution_start_time'] : {$set : data.execution_start_time},
                    ['id'] : {$set : data.id},
                    ['notes'] : {$set : data.notes},
                    ['professional_performer_name'] : {$set : data.professional_performer_name},
                    ['professional_responsible_name'] : {$set : data.professional_responsible_name},
                    ['schedules'] : {$set : data.schedules},
                    ['service_amount'] : {$set : data.service_amount},
                    ['service_place_name'] : {$set : data.service_place_name},
                    ['service_type_description'] : {$set : data.service_type_description}
                  }
                });

                  //get duration time
                  let start_date = new Date(data.execution_start_time);
                  let end_date = new Date(data.execution_end_time);
                  let selected_service_place, selected_professional, selected_service_type;
                  let selected_dates = [];

                  //* --------------------------------------------------------------------*/
                  // Loading data for Dropdown selectors.

                  for(let i = 0; i < tempState.forms.service_places.length; ++i){
                    if(tempState.forms.service_places[i].name === data.service_place_name){
                      //because the view is not 0 based, it's necessary to add 1 (one).
                      //(the view has a placeholder/hint)
                      selected_service_place = i+1;
                      break;
                    }
                  }

                  //and here we have to subtract 1 because the list is 0 based.
                  let filtered_lists = this.filter_input_lists(tempState.forms.service_places[selected_service_place - 1].id, tempState);

                  let filtered_professionals = filtered_lists['filtered_professionals'];

                  let filtered_service_types = filtered_lists['filtered_service_types'];

                  // 'i+1' because the input list has the placeholder in it.
                  for(let i = 0; i < filtered_professionals.length; ++i){
                    if(filtered_professionals[i].name === data.professional_performer_name){
                      selected_professional = i+1;
                      break;
                    }
                  }
                  for(let i = 0; i < filtered_service_types.length; ++i){
                    if(filtered_service_types[i].description === data.service_type_description){
                      selected_service_type = i+1;
                      break;
                    }
                  }

                  //* --------------------------------------------------------------------*/
                  //Loading data related to (hour) duration of shift
                  let startHour, startMinute;
                  let endHour, endMinutes;

                  startHour = start_date.getHours();
                  startMinute = start_date.getMinutes();

                  endHour = end_date.getHours();
                  endMinutes = end_date.getMinutes();

                  //* --------------------------------------------------------------------*/
                  //Loading data related to (date) duration of shift
                  let startDay, startMonth, startYear;
                  let endDay, endMonth, endYear;

                  startDay = start_date.getDate();
                  startMonth = start_date.getMonth() + 1;
                  startYear = start_date.getFullYear();

                  endDay = end_date.getDate();
                  endMonth = end_date.getMonth() + 1;
                  endYear = end_date.getFullYear();

                  //* --------------------------------------------------------------------*/
                  //Update state
                  let yearStartId = new Date().getFullYear() - 2;

                  let selectedDate = new Date();
                  selectedDate.setDate(start_date.getDate());
                  selectedDate.setMonth(start_date.getMonth());
                  selectedDate.setFullYear(start_date.getFullYear());

                  //necessary for the comparison when user clicks on the calendar
                  selectedDate.setHours(0);
                  selectedDate.setMinutes(0);
                  selectedDate.setSeconds(0);
                  selectedDate.setMilliseconds(0);
                  tempState =  update(tempState, {
                      aux: {
                        ['filtered_service_places'] : {$set: tempState.forms.service_places},
                        ['filtered_service_types'] : {$set: filtered_service_types},
                        ['filtered_professionals'] : {$set: filtered_professionals},
                        ['selected_service_place'] : {$set: selected_service_place},
                        ['selected_professional'] : {$set: selected_professional},
                        ['selected_service_type'] : {$set: selected_service_type},
                        ['start_hour'] : {$set: startHour},
                        ['start_min'] : {$set: startMinute},
                        ['end_hour'] : {$set: endHour},
                        ['end_min'] : {$set: endMinutes},
                        ['end_year_id'] : {$set: (endYear - yearStartId)},
                        ['start_year_id'] : {$set: (startYear - yearStartId)},
                        ['start_year'] : {$set: startYear},
                        ['end_year'] : {$set: endYear},
                        ['start_month'] : {$set: startMonth},
                        ['end_month'] : {$set: endMonth},
                        ['start_day'] : {$set: startDay},
                        ['end_day'] : {$set: endDay}
                      },
                    input_content: {
                        ['number_schedules']: {$set:  data.service_amount}
                    },
                    shift:{
                      ['service_place_id'] : {$set : tempState.forms.service_places[selected_service_place - 1].id},
                      ['service_type_id'] : {$set : filtered_service_types[selected_service_type - 1].id},
                      ['professional_performer_id'] : {$set: filtered_professionals[selected_professional - 1].id}
                    },
                    disabled_days : {
                        $set : [{ after: start_date, before: start_date }]
                    },
                    start_month: {$set: start_date},
                    selected_days: {$set : [selectedDate]}
                  });

              }
              this.setState(tempState, function(){
                if(this.props.current_role && this.props.current_role.role == 'adm_c3sl' && !this.props.is_edit) {
                  collection = 'forms/shift_index';
                  fetch(`${apiUrl}/${collection}?${params}`, {
                    headers: {
                      "Accept": "application/json",
                      "Content-Type": "application/json" },
                      method: "get",
                    }).then(parseResponse).then(resp => {
                      this.setState({ city_halls: resp.city_halls })
                    });
                  }
                  else
                  data['city_hall_id'] = this.props.current_role.city_hall_id

              });


            });
    }

  handleDayClick = (day, modifiers) => {
        if(modifiers['disabled'] == true)
          return;

        let selectedDays = this.state.selected_days;
        let i;
        let removed = false;
        day.setHours(0);
        day.setMinutes(0);
        day.setSeconds(0);
        day.setMilliseconds(0);


         for (i = 0; i < selectedDays.length && !removed; i++) {
            if(selectedDays[i].getTime() === day.getTime()){
              selectedDays.splice(i,1);
              removed = true;
            }
          }
          if(i == selectedDays.length && !removed){
            selectedDays.push(day);
          }
  	      this.setState({ selected_days: selectedDays});
  	  };

  calendarComponent() {
    		return (
    								<DayPicker
    										enableOutsideDays
    										locale="pt"
    										modifiers={ {
    												listDays: this.state.selected_days
    											} }
    								        months={MONTHS}
    								        weekdaysLong={WEEKDAYS_LONG}
    								        weekdaysShort={WEEKDAYS_SHORT}
                            onDayClick={this.handleDayClick}
                            disabledDays={this.state.disabled_days}
                            month={this.state.start_month}
    					          		/>
            )
    	}

  pickCityHall() {
    if(this.props.current_role && this.props.current_role.role != 'adm_c3sl') {
      return (
        <div className='select-field'>
          <div>
        <input disabled
           name="selected_city_hall"
           type='text'
           className='input-field shift'
           value={this.props.current_role.city_hall_name}
        />
      </div>
    </div>
      )
    }
    else{
      const cityHallsList = (
        this.state.city_halls.map((city_hall) => {
          return (
            <option key={city_hall.id} value={city_hall.id}>{city_hall.name}</option>
          )
        })
      )

      return (

        <div className='select-field'>
          <div>
            <Row className='shift-select'>
              <Input s={12}
                name="city_hall_id"
                type='select'
                value={this.state.aux.selected_city_hall}
                onChange={
                  (event) => {
                    if(event.target.value != this.state.aux.selected_city_hall) {
                      this.handleSelectorInputChange(event);
                    }
                  }
                }
                >
                <option value='0' disabled>Escolha a prefeitura</option>
                {cityHallsList}
              </Input>
            </Row>
          </div>
        </div>
      )
    }
  }

  pickServicePlace() {
    let servicePlaceList = this.state.aux.filtered_service_places == null ? [] : (
      this.state.aux.filtered_service_places.map((service_place, idx) => {
        return (
          <option key={service_place.id} value={idx+1}>{service_place.name}</option>
        )
      })
    )

    return (
      <div className='select-field'>
        <div>
          <Row className='shift-select'>
            <Input s={12} name="selected_service_place" value={this.state.aux.selected_service_place} type='select'
              onChange={
                (event) => {
                  if(event.target.value != this.state.aux.selected_service_place) {
                    this.handleSelectorInputChange(event);
                  }
                }
              }>
              <option value='0' disabled>Escolha o local de atendimento</option>
              {servicePlaceList}
            </Input>
          </Row>
        </div>
      </div>
    )
  }

  pickProfessional(){
    let professionalList = this.state.aux.filtered_professionals == null ? [] : (
      this.state.aux.filtered_professionals.map((professional, idx) => {
        return (
          <option key={professional.id} value={idx+1}>{professional.name}</option>
        )
      })
    )

    return (
      <div className='select-field'>
        <div>
          <Row className='shift-select'>
            <Input s={12} name="selected_professional" value={this.state.aux.selected_professional} type='select'
              onChange={
                (event) => {
                  if(event.target.value != this.state.aux.selected_professional) {
                    this.handleSelectorInputChange(event);
                  }
                }
              }>
              <option value='0' disabled>Escolha o profissional</option>
              {professionalList}
            </Input>
          </Row>
        </div>
      </div>
    )
  }

  pickServiceType(){
    let serviceTypeList = this.state.aux.filtered_service_types == null ? [] : (
      this.state.aux.filtered_service_types.map((service_type, idx) => {
        return (
          <option key={service_type.id} value={idx+1}>{service_type.description}</option>
        )
      })
    )

    return (
      <div className='select-field'>
        <div>
          <Row className='shift-select'>
            <Input s={12} name="selected_service_type" value={this.state.aux.selected_service_type} type='select'
              onChange={
                (event) => {
                  if(event.target.value != this.state.aux.selected_service_type) {
                    this.handleSelectorInputChange(event);
                  }
                }
              }>
              <option value='0' disabled>Escolha o tipo de atendimento</option>
              {serviceTypeList}
            </Input>
          </Row>
        </div>
      </div>
    )
  }

  confirmButton() {
    return (
      <div className="card-action">
        <a className='back-bt waves-effect btn-flat' href='#' onClick={this.props.prev}> Voltar </a>
        <button className="waves-effect btn right button-color"  name="commit"  onClick={this.handleSubmit}
          type="submit">{this.props.is_edit ? "Atualizar" : "Criar"}</button>
      </div>
    )
  }

  checkErrors() {

    let errors = []
    let aux = this.state.aux;
    let today_1month, selectedDayStart, selectedDayEnd;
    let testDate = true;

    /*
      Selectors Validation
    */

    if(this.props.current_role && this.props.current_role.role == 'adm_c3sl' && aux.selected_city_hall == 0){
        errors.push('Selecione a prefeitura');
    }
    else if(aux.selected_service_place == 0){
      errors.push('Selecione o local de atendimento');
    }else if(aux.selected_professional == 0){
      errors.push('Selecione o profissional');
    }else if(aux.selected_service_type == 0){
      errors.push('Selecione o tipo de atendimento');
    }

    /*
      Date validation
    */
    if(aux.start_year == '' ||  aux.start_month == ''  || aux.start_day == ''){
      testDate = false;
      errors.push('Selecione a data de início');
    }
    if(aux.end_year == '' || aux.end_month == '' || aux.end_day == ''){
      testDate = false;
      errors.push('Selecione a data de fim');
    }

    if(testDate){
      today_1month = new Date();
      selectedDayStart = new Date(aux.start_year, aux.start_month - 1, aux.start_day, 0, 0, 0);
      selectedDayEnd = new Date(aux.end_year, aux.end_month - 1, aux.end_day, 0, 0, 0);
      today_1month.setHours(0);
      today_1month.setMinutes(0);
      today_1month.setSeconds(0);
      today_1month.setMilliseconds(0);
      today_1month.setMonth(today_1month.getMonth()-1);


      if(selectedDayStart.getDate() !== Number(aux.start_day) || selectedDayStart.getMonth() !== (Number(aux.start_month) - 1)
          || selectedDayStart.getFullYear() !== aux.start_year){
          errors.push('Selecione uma data válida para início da escala');
      }
      if(selectedDayEnd.getDate() !== Number(aux.end_day) || selectedDayEnd.getMonth() !== (Number(aux.end_month) - 1)
          || selectedDayEnd.getFullYear() !== aux.end_year){
          errors.push('Selecione uma data válida para o limite da escala');
      }
      if(selectedDayStart > selectedDayEnd){
        errors.push('A data de fim deve ser depois da de início');
      }else if(selectedDayStart < today_1month){
        errors.push('Escalas só podem ser criadas até 1 (um) mês depois');
      }

    }

    /*
      Time of day validation
    */
      let hourStart = new Date();
      let hourEnd = new Date();

      hourStart.setHours(parseInt(this.state.aux.start_hour));
      hourStart.setMinutes(parseInt(this.state.aux.start_min));

      hourStart.setSeconds(0);

      hourEnd.setHours(parseInt(this.state.aux.end_hour));
      hourEnd.setMinutes(parseInt(this.state.aux.end_min));

      if(hourEnd < hourStart){
        errors.push('O horário de fim da escala deve ser depois do início');
      }

      /*
        Shift division validation
      */
      if(this.state.input_content.isTimeDivision === 'number_schedules' && this.state.input_content.number_schedules === 0){
        errors.push('A escala deve ter pelo menos 1 (um) atendimento por dia');
      }


      /*
          List of days Validation
      */

      if(this.state.selected_days.length === 0){
        errors.push('A escala deve ter pelo menos 1 (um) dia');
      }

    return errors;
  }

  handleSubmit() {

    //Check errors, case ok: submit form else: show errors
    let formData = this.state.data;
    let auxData = this.state.data;

    let errors = this.checkErrors();

    if(errors.length > 0){
      //show errors
      let full_error_msg = "";
      errors.forEach(function(elem){ full_error_msg += elem + '\n' });
      Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});

    }else{
      let fetch_body = this.generateBody();
      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
      const collection = this.props.fetch_collection;
      var params = this.props.fetch_params;
      console.log(fetch_body);
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
        method: this.props.fetch_method,
        body: JSON.stringify(fetch_body)
      }).then(parseResponse).then(resp => {
        if(this.props.is_edit){
          Materialize.toast('Escala editada com sucesso.', 10000, "green",function(){$("#toast-container").remove()});
        }
        else{
          Materialize.toast('Escala criada com sucesso.', 10000, "green",function(){$("#toast-container").remove()});
        }
        browserHistory.push(this.props.submit_url);
      }).catch(({errors}) => { // TODO: UPDATE ERRORS ARRAY ACCORDING TO API
        if(errors) {
          let full_error_msg = "";
          errors.forEach(function(elem){ full_error_msg += elem + '\n' });
          Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
          throw errors;
        }
      });

    }

  }

  generateBody() {
    var final_shift_items = [];
    let formData = this.state.shift;
    var dates = this.state.selected_days;

    let hour_begin = this.state.aux.start_hour;
    let hour_end = this.state.aux.end_hour;

    let minute_begin = this.state.aux.start_min;
    let minute_end = this.state.aux.end_min;

    let number_of_shifts = dates.length;
    let aux = {};
    let service_amount_day;


    if(this.state.input_content.isTimeDivision === 'number_schedules'){
      service_amount_day = this.state.input_content.number_schedules;
    }else{
      service_amount_day = (hour_end - hour_begin)/this.state.input_content.duration_schedule_min;
    }

    if(this.props.is_edit){
      aux['id'] = this.state.shift.id;
      aux['service_type_id'] = Number(this.state.shift.service_type_id);
      aux['professional_performer_id'] = Number(formData.professional_performer_id);
      aux['professional_responsible_id'] = Number(this.props.current_role.professional_id);
      aux['execution_start_time'] = new Date(dates[0].setHours(Number(hour_begin), Number(minute_begin)));
      aux['execution_end_time'] = new Date(dates[0].setHours(Number(hour_end), Number(minute_end)));
      aux['service_amount'] = service_amount_day;
      aux['service_place_id'] = Number(this.state.shift.service_place_id);
      aux['notes'] = formData.notes;
      final_shift_items.push(aux);
    }else{
      for(let i = 0; i < number_of_shifts; i++){
        aux['service_type_id'] = Number(this.state.shift.service_type_id);
        aux['professional_performer_id'] = Number(formData.professional_performer_id);
        aux['professional_responsible_id'] = Number(this.props.current_role.professional_id);
        aux['execution_start_time'] = new Date(dates[i].setHours(Number(hour_begin), Number(minute_begin)));
        aux['execution_end_time'] = new Date(dates[i].setHours(Number(hour_end), Number(minute_end)));
        aux['service_amount'] = service_amount_day;
        aux['service_place_id'] = Number(this.state.shift.service_place_id);
        aux['notes'] = formData.notes;

        final_shift_items.push(aux);

        aux = {};
      }

    }
    this.setState({shift: final_shift_items});

    /* adaptate fetch object info to api request */
    let fetch_body = {'shifts': []};
    fetch_body['shifts'] = final_shift_items;


    return this.props.is_edit ? aux : fetch_body;

  }

  /*
    Handle changes to fields:
    - start_hour
    - start_min
    - end_hour
    - end_min
  */
  handleHourChange(event){
    const target = event.target;
    const name = target.name;
    const value = target.value;
    let updateValue = value;
    if(target.validity.valid) {
      if(name == 'start_hour' || name == 'end_hour'){
        if(value < 0)
          updateValue = 0;
        else if(value > 23)
          updateValue = 23;
      }else if(name == 'start_min' || name == 'end_min'){
        if(value < 0)
          updateValue = 0;
        else if(value > 59)
          updateValue = 59;
      }

      this.setState({
        aux: update(this.state.aux, { [name]: {$set: updateValue} })
      });
    }
  }

  /*
    Handle changes to fields:
    - start_year_id
    - start_month
    - end_year_id
    - end_day
    - end_month
  */
  handleDateInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if(target.validity.valid) {

      let end_year = this.state.aux.end_year;
      let start_year = this.state.aux.start_year;
      let yearStart = new Date();
      yearStart = yearStart.getFullYear() - 1;

      if(name === 'end_year_id'){
          end_year =  parseInt(value)+parseInt(yearStart-1);
      }
      else if(name === 'start_year_id'){
          start_year =  parseInt(value)+parseInt(yearStart-1);
      }

      this.setState({
        aux: update(this.state.aux,{ [name]: {$set: value},
        ['end_year']: {$set: end_year},
        ['start_year']: {$set: start_year}
        })
      }, function(){

          const aux = this.state.aux;
          let start_month = this.state.start_month;
          let new_disabled_days = [];
          let today = new Date();

          if(aux.start_day !== '' && aux.start_year !== '' && aux.start_month !== '' && aux.end_year !== '' && aux.end_month !== '' && aux.end_day !== ''){
            let selectedDayStart = new Date(aux.start_year, aux.start_month - 1, aux.start_day, 0, 0, 0);
            let selectedDayEnd = new Date(aux.end_year, aux.end_month - 1, aux.end_day, 0, 0, 0);

            if(selectedDayEnd < selectedDayStart){
              new_disabled_days.push(today);
              new_disabled_days.push({after: today, before: today});
            }else{
              new_disabled_days.push({after: selectedDayEnd, before: selectedDayStart});
              start_month = selectedDayStart;
            }
          }else{
            new_disabled_days.push(today);
            new_disabled_days.push({after: today, before: today});
          }

          this.setState({
            disabled_days: new_disabled_days,
            start_month: start_month
          });
      });

    }
  }

  /*
    Handle changes to field:
    - notes
  */
  handleTextInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if(target.validity.valid) {
      //if user is adding text and there is space
      if(value.length > this.state.shift.notes.length && this.state.aux.remaining_text > 0){

        this.setState({
          shift: update(this.state.shift, {[name]: {$set: value}}),
          aux: update(this.state.aux, {['remaining_text']: {$set: 140 - value.length}})
        })
      }else if(value.length < this.state.shift.notes.length && value.length >= 0){
        this.setState({
          shift: update(this.state.shift, {[name]: {$set: value}}),
          aux: update(this.state.aux, {['remaining_text']: {$set: (140 - value.length) }})
        })
      }

    }
  }

  /*
  Handle changes to fields:
  - selected_service_place
  - selected_professional
  - selected_service_type
  - city_hall_id
  */
  handleSelectorInputChange(event) {
    /*
    since the size of these lists will not get too big (probably less than 100 places for each professional, or
    100 types for a location) the list is done every time the selector is clicked, rather than once, when the page is loaded.
    */
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if(target.validity.valid) {
      if(name === 'city_hall_id'){
        let filtered_places = [];
        for(let i = 0; i < this.state.forms.service_places.length; ++i){
            if(Number(this.state.forms.service_places[i].city_hall_id) === Number(this.state.city_halls[value - 1].id)){
              filtered_places.push(this.state.forms.service_places[i]);
            }
        }
        this.setState({
          aux: update(this.state.aux, {
            ['filtered_service_places']: {$set: filtered_places},
            ['selected_city_hall']: {$set: value},
            ['selected_service_place']: {$set: 0},
            ['selected_professional'] : {$set: 0},
            ['selected_service_type'] : {$set: 0}
          })
        });
      }
      else if(name === 'selected_service_place'){
        let filtered_lists = this.filter_input_lists(this.state.forms.service_places[value-1].id);

        this.setState({
          aux: update(this.state.aux,{
            ['filtered_professionals'] : {$set: filtered_lists['filtered_professionals']},
            ['filtered_service_types'] : {$set: filtered_lists['filtered_service_types']},
            ['selected_professional'] : {$set: 0},
            ['selected_service_type'] : {$set: 0},
            [name] : {$set : value}
          }),
          shift: update(this.state.shift, {
            ['service_place_id'] : {$set : this.state.forms.service_places[value - 1].id}
          })
        });
      }else{
        let professional_id =  this.state.shift.professional_performer_id;
        let service_type_id = this.state.shift.service_type_id;

        if(name === 'selected_professional'){
          professional_id = this.state.aux.filtered_professionals[value - 1].id;
        }else if(name === 'selected_service_type'){
          service_type_id = this.state.aux.filtered_service_types[value - 1].id;
        }
        this.setState({
          aux: update(this.state.aux, {
            [name] : {$set : value}
          }),
          shift: update(this.state.shift, {
            ['professional_performer_id'] : {$set : professional_id},
            ['service_type_id'] : {$set : service_type_id}
          })
        });
      }

    }
  }

  /*
  Handle changes to fields:
  - isTimeDivision
  - number_schedules
  - duration_schedule_min
  */
  handleInputDivisonChange(event){
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if(target.validity.valid){
      this.setState({
        input_content: update(this.state.input_content, {[name]: {$set: value}}),
      }, function (){
        if(name === 'isTimeDivision'){
            this.setState({
              input_content: update(this.state.input_content, {['number_schedules']: {$set: 0}})
            }, function(){
              this.setState({input_content: update(this.state.input_content, {['duration_schedule_min']: {$set: 10}})});
            });
          }
      });
    }
  }

  selectStartDate(){
      var optionsDays = [];
      optionsDays.push(<option key={0} value="" disabled>Dia</option>);
      for(var i = 1; i <= 31; i++){
        optionsDays.push(
          <option key={i} value={i}>{i}</option>
        );
      }
      var optionsMonths = []
      optionsMonths.push(<option key={0} value="" disabled>Mês</option>);
      var months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      for(var i = 0; i < 12; i++){
        optionsMonths.push(
          <option key={i+1} value={i+1}>{months[i]}</option>
        );
      }
      var optionsYears = []
      optionsYears.push(<option key={0} value="" disabled>Ano</option>);
      var year = new Date().getFullYear();
      var yearStart = year - 1;
      //generate list of years like:
      // {last year, year, next year}
      for(var i = yearStart; i < (year + 2); i++){
        optionsYears.push(
          <option key={i - (yearStart - 1)} value={i - (yearStart - 1)}>{i}</option>
        );
      }
      return (
        <div>
          <Input s={12} l={3}
            type='select'
            name='start_day'
            value={this.state.aux.start_day}
            onChange={this.handleDateInputChange}
          >
            {optionsDays}
          </Input>

          <Input s={12} l={4}
            type='select'
            name='start_month'
            value={this.state.aux.start_month}
            onChange={this.handleDateInputChange}
          >
            {optionsMonths}
          </Input>

          <Input s={12} l={4}
            type='select'
            name='start_year_id'
            value={this.state.aux.start_year_id}
            onChange={(event) => {this.handleDateInputChange(event)}}>
            {optionsYears}
          </Input>
        </div>
      )
  }

  selectEndDate(){
      var optionsDays = [];
      optionsDays.push(<option key={0} value="" disabled>Dia</option>);
      for(var i = 1; i <= 31; i++){
        optionsDays.push(
          <option key={i} value={i}>{i}</option>
        );
      }
      var optionsMonths = []
      optionsMonths.push(<option key={0} value="" disabled>Mês</option>);
      var months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      for(var i = 0; i < 12; i++){
        optionsMonths.push(
          <option key={i+1} value={i+1}>{months[i]}</option>
        );
      }
      var optionsYears = []
      optionsYears.push(<option key={0} value="" disabled>Ano</option>);
      var year = new Date().getFullYear()
      var yearStart = year - 1;
      for(var i = yearStart; i < (year + 2); i++){
        optionsYears.push(
          <option key={i - (yearStart - 1)} value={i - (yearStart - 1)}>{i}</option>
        );
      }
      return (
        <div>
          <Input s={12} l={3}
            type='select'
            name='end_day'
            value={this.state.aux.end_day}
            onChange={this.handleDateInputChange}
          >
            {optionsDays}
          </Input>

          <Input s={12} l={4}
            type='select'
            name='end_month'
            value={this.state.aux.end_month}
            onChange={this.handleDateInputChange}
          >
            {optionsMonths}
          </Input>

          <Input s={12} l={4}
            type='select'
            name='end_year_id'
            value={this.state.aux.end_year_id}
            onChange={ (event) => {this.handleDateInputChange(event)}}>
            {optionsYears}
          </Input>
        </div>
      )
  }

  render() {

    const min = 0;
    const col_small_input = 12;
    const col_large_input = 7;
    const col_medium_input = 10;
    return (
      <Row s={12}>
        <div className='card'>
          <div className='card-content'>
            <Row className='first-line'>
              <Col s={12} className='page-header'>
                {this.props.is_edit ?
                  <h2 className="card-title">Alterar escala</h2>
                  :
                  <h2 className="card-title">Cadastrar Escala</h2>
                }
              </Col>

              <Row>
                {
                  this.props.is_edit ?
                  <div/>
                  :
                  <div>
                    <h6>Prefeitura:</h6>
                    <Col s={col_small_input} m={col_medium_input} l={col_large_input} >
                      <div>
                        {this.pickCityHall()}
                      </div>
                    </Col>
                  </div>
                }

              </Row>

              <Row>
                <h6>Local de Atendimento*:</h6>
                  <Col s={col_small_input} m={col_medium_input} l={col_large_input}>
                    <div>
                      {this.pickServicePlace()}
                    </div>
                  </Col>
                </Row>

              <Row>
                  <h6>Profissional*:</h6>
                  <Col s={col_small_input} m={col_medium_input} l={col_large_input}>
                    <div>
                      {this.pickProfessional()}
                    </div>
                  </Col>
              </Row>

              <Row>
                  <h6>Tipo de Atendimento*:</h6>
                  <Col s={col_small_input} m={col_medium_input} l={col_large_input}>
                    <div>
                      {this.pickServiceType()}
                    </div>
                  </Col>
              </Row>
              <Row>
                  <div>
                    <h6>Duração (intervalo do dia)*:</h6>
                  </div>
                  <Row>
                    <Col s={1}>
                      <h6 className='input-description'>De:</h6>
                    </Col>
                    <Col s={2}>
                      <input  type='number'   name='start_hour' className='check-input'
                        value={this.state.aux.start_hour} onChange={this.handleHourChange}/>
                    </Col>
                    <Col s={1}>
                      <h6 className='input-description'>h</h6>
                    </Col>
                    <Col s={2}>
                      <input  type='number' name='start_min'
                        value={this.state.aux.start_min} onChange={this.handleHourChange}/>
                    </Col>
                    <Col s={2}>
                      <h6 className='input-description'>min</h6>
                    </Col>
                  </Row>
                  <Row>
                    <Col s={1}>
                      <h6 >Até:</h6>
                    </Col>
                    <Col s={2}>
                      <input  type='number'  name='end_hour'
                        value={this.state.aux.end_hour} onChange={this.handleHourChange}/>
                    </Col>
                    <Col s={1}>
                      <h6>h</h6>
                    </Col>
                    <Col s={2}>
                      <input  type='number' name='end_min'
                        value={this.state.aux.end_min} onChange={this.handleHourChange}/>
                    </Col>
                    <Col s={2}>
                      <h6>min</h6>
                    </Col>
                  </Row>
                </Row>
              <Row>
                  <div s={6}>
                    <h6>A partir de*:</h6>
                    {this.selectStartDate()}

                  </div>
              </Row>
              <Row>
                  <div>
                    <h6>Até*:</h6>
                      {this.selectEndDate()}
                  </div>
              </Row>
              {
                this.props.is_edit ?
                  <div></div>
                  :
                  <div>
                    <Row className='calendar'>
                      <Col s={12} m={8} l={6}>
                        <h6>Pré-visualização:</h6>
                        <div>
                          {this.calendarComponent()}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col s={12} m={8} l={6}>
                        <div className='card'>
                          <div className='card-content'>
                            <h6>Legenda:</h6>
                            <Row>
                                <div className='legend-item'/>
                                <h6 className='legend-text'>
                                  Datas disponíveis para escolha
                                </h6>
                            </Row>
                            <Row>
                              <div className='legend-item legend-invalid-date'/>
                              <h6 className='legend-text'>
                                Datas indisponíveis
                              </h6>
                            </Row>
                            <Row>
                              <div className='legend-item legend-available'/>
                              <h6 className='legend-text'>
                                Datas selecionadas e disponíveis
                              </h6>
                            </Row>
                            <Row>
                              <div className='legend-item legend-conflict'/>
                              <h6 className='legend-text'>
                                Datas conflitantes com outras escalas
                              </h6>
                            </Row>
                          </div>
                        </div>
                      </Col>
                    </Row>
              </div>
                }

              <Row className='margin-bottom-five'>
                    <h6>Observações:</h6>
              </Row>
              <Row>
                  <Col s={12} m={8} l={6}>
                    <Input type='text' name='notes' className='fixed-size-three'
                      value={this.state.shift.notes} onChange={this.handleTextInputChange}/>
                  </Col>
              </Row>
              <Row>
                  <p>Caracteres restantes:{this.state.aux.remaining_text}</p>
              </Row>


                    <Row>
                      <div >
                        <h6>Quantidade de atendimentos*:</h6>
                        <Row>
                          <Col s={12} >

                            <Input name='isTimeDivision' type='radio' className='with-gap'  label='Número de atendimentos:'
                              checked={this.state.input_content.isTimeDivision === 'number_schedules'} onChange={this.handleInputDivisonChange} value={'number_schedules'}/>

                            <Input name='number_schedules' type='number' className='fixed-size-hundred' min={min} disabled={this.state.input_content.isTimeDivision !== 'number_schedules'}
                              value={this.state.input_content.number_schedules} onChange={this.handleInputDivisonChange}/>


                          </Col>
                          <Col s={12}>
                            <Input name='isTimeDivision' type='radio'className='with-gap'  label='Tempo de atendimento(minutos):'
                              checked={this.state.input_content.isTimeDivision === 'time_division'} onChange={this.handleInputDivisonChange} value={'time_division'}/>

                            <Input name='duration_schedule_min' type='select' className='fixed-size-hundred' disabled={this.state.input_content.isTimeDivision !== 'time_division'}
                              value={this.state.input_content.duration_schedule_min} onChange={this.handleInputDivisonChange}>
                                <option key={0} value={5}>5</option>
                                <option key={1} value={10}>10</option>
                                <option key={2} value={15}>15</option>
                                <option key={3} value={20}>20</option>
                                <option key={4} value={25}>25</option>
                                <option key={5} value={30}>30</option>
                                <option key={6} value={35}>35</option>
                                <option key={7} value={40}>40</option>
                                <option key={8} value={45}>45</option>
                                <option key={9} value={50}>50</option>
                                <option key={10} value={55}>55</option>
                          </Input>
                          </Col>
                        </Row>
                      </div>
                    </Row>

              <p className="red-text">Campos com (*) são de preenchimento obrigatório.</p>
            </Row>
            {this.confirmButton()}
          </div>
        </div>
      </Row>
    )
  }
}

const ShiftForm = connect()(getShiftForm)
export default ShiftForm
