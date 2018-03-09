import React, {Component} from 'react'
import { connect } from 'react-redux'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
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
      }
    };
  }


  componentDidMount() {
      console.log('componentDidMount ShitForm.jsx');
      var self = this;
      var data = this.props.is_edit ? this.props.data : this.state.shift

      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      var collection = 'forms/create_shift';
      const params = this.props.fetch_params;

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


    calendarComponent() {
      return (
        <div>
            <Row>
              <Col s={12}
                className='card-panel calendar-panel'>
                  <Input name='on' type='date' />
              </Col>
              </Row>
        </div>
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
                    <h6>Duração:</h6>
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
                  </div>
                  <Input name='datePicker' type='date' className='datepicker'/>
                </Row>
                <Row>
                  <div>
                    <h6>Até*:</h6>
                  <Input name='datePicker' type='date' className='datepicker'/>
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
                  <div className="filed-input">
                    <h6>Observações</h6>
                    <Input type='text'/>
                    <p>Caracteres restantes:140</p>
                  </div>
                </Row>

                <Row>
                  <div >
                    <h6>Atendimentos:</h6>
                    <Row>
                      <div >
                        <Input name='group1' type='radio'
                           value='green' label='Número de atendimentos:'
                           className='with-gap' checked='true'/>
                         <Input type='number' min={1}/>
                      </div>
                    </Row>
                    <Row>
                      <Input name='group1' type='radio'
                         value='green' label='Tempo de atendimento (minutos):' className='with-gap'/>
                       <Input type='number' />
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
