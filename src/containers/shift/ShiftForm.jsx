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


const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julia', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const WEEKDAYS_LONG = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const WEEKDAYS_SHORT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

function addZeroBefore(n) {
  return (n < 10 ? '0' : '') + n;
}

class getShiftForm extends Component {

 constructor(props) {
    super(props)

    var today = new Date()
    var today_3months = new Date()
    today_3months.setMonth(today_3months.getMonth()+3)

    this.state = {
      city_halls: [],
      forms: [],
      shift: {
        active: true,
        description: '',
        sector_id: 0,
        city_hall_id: 0,
        selected_service_place: 0,
        selected_professional: 0,
        selected_service_type: 0
      },
      aux: {
        end_year_id: '',
        start_year_id: '',
        start_year: '',
        end_year: '',
        start_month : '',
        end_month: '',
        start_day: '',
        end_day: ''
      },
      disabledDays: [{ after: today_3months, before: today }],
      selected_days: [],
      isTimeDivision: false
    };
  }


  componentDidMount() {
      console.log('componentDidMount ShitForm.jsx');
      var self = this;
      var data = this.props.is_edit ? this.props.data : this.state.shift

      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;


      var collection = 'forms/create_shift';
      //var collection = 'forms/schedule_index';

      const params = this.props.fetch_params;
      //const params = 'permission=2';

      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get",
      }).then(parseResponse).then(resp => {
        self.setState({ forms: resp })
        console.log('Executou a request');
        console.log(this.state.forms);
      });

      if(this.props.current_role && this.props.current_role.role == 'adm_c3sl') {
        collection = 'forms/shift_index';
        fetch(`${apiUrl}/${collection}?${params}`, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json" },
            method: "get",
        }).then(parseResponse).then(resp => {
          self.setState({ city_halls: resp.city_halls })
        });
      }
      else
        data['city_hall_id'] = this.props.current_role.city_hall_id


      self.setState({ service_type: data })

    }


    handleDayClick = (day, modifiers) => {
  	    //encontrar o dia no array de dias, remover ele e atualizar o estado;
        let selectedDays = this.state.selected_days;
        let i;
        let removed = false;

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
          console.log(this.state);
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
                            onDayClick={this.handleDayClick.bind(this)}
                            disabledDays={this.state.disabledDays}
    					          		/>
            )
    	}


  pickCityHall() {
    if(this.props.current_role && this.props.current_role.role != 'adm_c3sl') {
      return (
        <input disabled
           name="selected_city_hall"
           type='text'
           className='input-field'
           value={this.props.current_role.city_hall_name}
        />
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
        value={this.state.service_type.city_hall_id}
        onChange={
          (event) => {
            if(event.target.value != this.state.selected_city_hall) {
                this.handleInputServiceTypeChange(event);
            }
          }
        }
      >
        <option value='0' disabled>Escolha a prefeitura</option>
        {cityHallsList}
      </Input>
    )
  }


  confirmButton() {
    return (
      <div className="card-action">
        <a className='back-bt waves-effect btn-flat' href='#' onClick={this.props.prev}> Voltar </a>
        <button className="waves-effect btn right button-color"  name="commit"
          type="submit">{this.props.is_edit ? "Atualizar" : "Criar"}</button>
      </div>
    )
  }

  handleDateInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if(target.validity.valid) {
      this.setState({
        aux: update(this.state.aux, { [name]: {$set: value} })
      })
      console.log('handleDateInputChange');
      {
        console.log(this.state.aux);
      }
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if(target.validity.valid) {
      this.setState({
        shift: update(this.state.shift, { [name]: {$set: value} })
      })
      console.log('handleInputChange');
      {console.log(this.state.shift);}
    }
  }

  handleInputCheckBoxChange(event){
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if(target.validity.valid) {
        this.setState({
          isTimeDivision: value
        });
    }
    console.log('alo alo');
  }

  pickProfessional(){
    let professionalList = this.state.forms.professionals == null ? [] : (
      this.state.forms.professionals.map((professional, idx) => {
        return (
          <option key={professional.id} value={idx+1}>{professional.name}</option>
        )
      })
    )

		return (
			<div className='select-field'>
				<div>
					<Row className='shift-select'>
            <Input s={12} name="selected_professional" value={this.state.shift.selected_professional} type='select'
              onChange={
                (event) => {
                  if(event.target.value != this.state.shift.selected_professional) {
                      this.handleInputChange(event);
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

  pickServicePlace() {
    let servicePlaceList = this.state.forms.service_places == null ? [] : (
      this.state.forms.service_places.map((service_place, idx) => {
        return (
          <option key={service_place.id} value={idx+1}>{service_place.name}</option>
        )
      })
    )

		return (
			<div className='select-field'>
				<div>
					<Row className='shift-select'>
            <Input s={12} name="selected_service_place" value={this.state.shift.selected_service_place} type='select'
              onChange={
                (event) => {
                  if(event.target.value != this.state.shift.selected_service_place) {
                      this.handleInputChange(event);
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
      var year = new Date().getFullYear()
      for(var i = year; i > 1900; i--){
        optionsYears.push(
          <option key={i-1899} value={i-1899}>{i}</option>
        );
      }
      return (
        <div>
          <Input s={12} l={3}
            type='select'
            name='start_day'
            value={this.state.aux.start_day}
            onChange={this.handleDateInputChange.bind(this)}
          >
            {optionsDays}
          </Input>

          <Input s={12} l={4}
            type='select'
            name='start_month'
            value={this.state.aux.start_month}
            onChange={this.handleDateInputChange.bind(this)}
          >
            {optionsMonths}
          </Input>

          <Input s={12} l={4}
            type='select'
            name='start_year_id'
            value={this.state.aux.start_year_id}
            onChange={ (event) => {
                this.handleDateInputChange.bind(this)(event)
                this.setState({aux: update(this.state.aux,
                  {
                    start_year: {$set: parseInt(this.state.aux.start_year_id)+parseInt(1899)},
                  })
                })
              }
            }
          >
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
      for(var i = year; i > 1900; i--){
        optionsYears.push(
          <option key={i-1899} value={i-1899}>{i}</option>
        );
      }
      return (
        <div>
          <Input s={12} l={3}
            type='select'
            name='end_day'
            value={this.state.aux.end_day}
            onChange={this.handleDateInputChange.bind(this)}
          >
            {optionsDays}
          </Input>

          <Input s={12} l={4}
            type='select'
            name='end_month'
            value={this.state.aux.end_month}
            onChange={this.handleDateInputChange.bind(this)}
          >
            {optionsMonths}
          </Input>

          <Input s={12} l={4}
            type='select'
            name='end_year_id'
            value={this.state.aux.end_year_id}
            onChange={ (event) => {
                this.handleDateInputChange.bind(this)(event)
                this.setState({aux: update(this.state.aux,
                  {
                    end_year: {$set: parseInt(this.state.aux.end_year_id)+parseInt(1899)},
                  })
                })
              }
            }
          >
            {optionsYears}
          </Input>
        </div>
      )
  }

  pickServiceType(){
    let serviceTypeList = this.state.forms.service_types == null ? [] : (
      this.state.forms.service_types.map((service_type, idx) => {
        return (
          <option key={service_type.id} value={idx+1}>{service_type.description}</option>
        )
      })
    )

    return (
      <div className='select-field'>
        <div>
          <Row className='shift-select'>
            <Input s={12} name="selected_service_type" value={this.state.shift.selected_service_type} type='select'
              onChange={
                (event) => {
                  if(event.target.value != this.state.shift.selected_service_type) {
                      this.handleInputChange(event);
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

  render() {

    const min = 0;
    const max_hour = 23;
    const max_min = 59;
    const col_small_input = 12;
    const col_large_input = 7;
    const col_medium_input = 10;
    var firstSelected = true;
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
                <h6>Prefeitura:</h6>
                <Col s={col_small_input} m={col_medium_input} l={col_large_input} >
                  <div>
                    {this.pickCityHall()}
                  </div>
                </Col>
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
                      <input  type='number'  min={min} max={max_hour} className='check-input'/>
                    </Col>
                    <Col s={1}>
                      <h6 className='input-description'>h</h6>
                    </Col>
                    <Col s={2}>
                      <input  type='number' min={min} max={max_min}/>
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
                      <input  type='number'  min={min} max={max_hour}/>
                    </Col>
                    <Col s={1}>
                      <h6>h</h6>
                    </Col>
                    <Col s={2}>
                      <input  type='number' min={min} max={max_min}/>
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
              <h6>Incluir:</h6>
              <Row>
                  <Col s={12} m={4} l={2}>
                    <Input name='day1' type='checkbox' className="filled-in checkbox" value='Dom' label='Dom' />
                  </Col>
                  <Col s={12} m={4} l={2}>
                    <Input name='day2' type='checkbox' className="filled-in checkbox" value='Seg' label='Seg' />
                  </Col>
                  <Col s={12} m={4} l={2}>
                    <Input name='day3' type='checkbox' className="filled-in checkbox" value='Ter' label='Ter' />
                  </Col>
                  <Col s={12} m={4} l={2}>
                    <Input name='day4' type='checkbox' className="filled-in" value='Qua' label='Qua' />
                  </Col>
                  <Col s={12} m={4} l={2}>
                    <Input name='day5' type='checkbox' className="filled-in" value='Qui' label='Qui' />
                  </Col>
                  <Col s={12} m={4} l={2}>
                    <Input name='day6' type='checkbox' className="filled-in" value='Sex' label='Sex' />
                  </Col>
                  <Col s={12} m={4} l={2}>
                    <Input name='day7' type='checkbox' className="filled-in" value='Sab' label='Sab' />
                  </Col>
              </Row>

              <Row>

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

              <Row>
                    <h6>Observações</h6>
              </Row>
              <Row>
                  <Col s={12} m={8} l={6}>
                    <Input type='text'/>
                  </Col>
              </Row>
              <Row>
                  <p>Caracteres restantes:140</p>
              </Row>

              <Row>
                  <div >
                    <h6>Atendimentos*:</h6>
                    <Row>
                      <div >
                        <Input name='group1' type='radio'
                           label='Número de atendimentos:'
                           value={false}
                           onChange={this.handleInputCheckBoxChange.bind(this)}
                           className='with-gap' checked='true'/>
                         {
                          this.state.isTimeDivision ?
                          <Input type='number' disabled/> :
                          <Input type='number' min={1}/>
                         }
                      </div>
                  </Row>
                  <Row>
                      <Input name='group1' type='radio'
                        onChange={this.handleInputCheckBoxChange.bind(this)}
                        value={true}
                        label='Tempo de atendimento (minutos):' className='with-gap'/>
                       {
                        this.state.isTimeDivision ?
                        <Input type='number'/> :
                          <Input type='number' disabled/>
                       }
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
