import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ScheduleChoose.css'
import DayPicker, { DateUtils } from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julia', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const WEEKDAYS_LONG = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const WEEKDAYS_SHORT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

class getScheduleChoose extends Component {
  constructor(props) {
      super(props)
      var today = new Date()
      var today_3months = new Date()
      today_3months.setMonth(today_3months.getMonth()+3)
      this.state = {
          selected_sector: '0',
          selected_service_type: '0',
          selected_service_place: '0',
          selected_time: '0',
          update_service_types: 0,
          update_service_places: 0,
          update_calendar: 0,
          update_times: 0,
          sectors: [],
          service_types: [],
          service_places: [],
          selectedDay: null,
          disabledDays: [{ after: today_3months, before: today }],
          available_days: {start_times: [], end_times: []},
          times: []
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'sectors';
    const params = `permission=${this.props.user.current_role}&citizen_id=${this.props.user.citizen.id}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ sectors: resp })
    });
  }

  componentDidUpdate() {
    if(this.state.update_service_types != 0) { 
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = 'service_types';
      const params = `permission=${this.props.user.current_role}&schedule=true&citizen_id=${this.props.user.citizen.id}&sector_id=${this.state.selected_sector}`
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get",
      }).then(parseResponse).then(resp => {
        this.setState({ service_types: resp })
        this.setState({ update_service_types: 0 })
      }); 
    }

    if(this.state.update_service_places != 0) { 
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = 'service_places';
      const params = `permission=${this.props.user.current_role}&schedule=true&citizen_id=${this.props.user.citizen.id}&service_type_id=${this.state.selected_service_type}`
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get",
      }).then(parseResponse).then(resp => {
        this.setState({ service_places: resp })
        this.setState({ update_service_places: 0 })
      }); 
    }

    if(this.state.update_calendar != 0) { 
      const schedules = (this.state.service_places[this.state.selected_service_place-1].schedules)
      this.state.available_days = {start_times: [], end_times: []}
      this.state.service_places[this.state.selected_service_place-1].schedules.map((schedule,idx) => {
        this.state.available_days.start_times[idx] = new Date(schedule.service_start_time);
        this.state.available_days.end_times[idx] = new Date(schedule.service_end_time);
      })
      this.setState({ update_calendar: 0 })
    }

    if(this.state.update_times != 0) { 
      this.state.times = []
      if(this.state.selectedDay) {
        this.state.available_days.start_times.map((time, idx) => {
          if(time.getDate() == this.state.selectedDay.getDate()) {
            this.state.times.push(time)
          }
        })
      }
      this.setState({ update_times: 0 })
    }

  }

	mainComponent() {
		return (
			<div className='card'>
	          <div className='card-content'>
	            <h2 className='card-title h2-title-home'> Passo 2 de 3 - Agendamento </h2>
	            {this.pickSector()}
	            {this.pickServiceType()}
	            {this.pickServicePlace()}
	          	{this.calendarComponent()}
	          </div>
	          {this.confirmButton()}
	    	</div>
		)
	}

	handleDayClick = (day, modifiers) => {
	   if (this.state.selectedDay == day) {
	      this.setState({ selectedDay: null, update_times: 1 });
	    } else if(modifiers.available) {
	      this.setState({ selectedDay: day, update_times: 1 });
	    }
	  };

	calendarComponent() {
    const timeList = (
      this.state.times.map((time, idx) => {
        return (
          <option value={idx+1}>{`${time.getHours()}:${time.getMinutes()}`}</option>
        )
      })
    )
		return (
			<div>
				<div className='select-field'>
					<b>4. Escolha o tipo de atendimento:</b>
					<br></br>
					<Row>
						<Col className='card-panel calendar-panel'>
								<DayPicker
										enableOutsideDays
										modifiers={ {
												available: this.state.available_days.start_times
											} }
										locale="pt"
								        months={MONTHS}
								        weekdaysLong={WEEKDAYS_LONG}
								        weekdaysShort={WEEKDAYS_SHORT}
						          		selectedDays={this.state.selectedDay}
					          			onDayClick={this.handleDayClick}
					          			disabledDays={this.state.disabledDays}
					          		/>
				        </Col>
				        <Col>
				          	<div className='card-panel'>
					          	<b>Horários disponíveis na data selecionada </b>
								<br></br>
				          		<Row className='sector-select'>
								  <Input name="selected_time" type='select' value={this.state.selected_time} onChange={ (event) => { this.handleInputChange(event); } } >
                    <option value='0' disabled>Escolha o horário</option>
                    {timeList}
								  </Input>
								</Row>
				          	</div>
				         </Col>
				    </Row>
			    </div>
			</div>
          	)
	}

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

	pickSector() {
    const sectorsList = (
      this.state.sectors.map((sector) => {
        return (
          <option value={sector.id}>{sector.name}</option>
        )
      })
    )
		return (
			<div className='select-field'>
				<b>1. Escolha o setor:</b>
				<br></br>
				<span>
				Se um setor está desabilitado é porque você ultrapassou o número máximo de agendamentos permitidos.
				</span>
				<div>
					<Row className='sector-select'>
					  <Input s={12} l={4} m={12} name="selected_sector" type='select' value={this.state.selected_sector} 
              onChange={ 
                (event) => { 
                  if(event.target.value != this.state.selected_sector) {
                    this.handleInputChange(event); 
                    this.setState({ 
                      update_service_types: 1,
                      selected_service_type: '0',
                      selected_service_place: '0',
                      selectedDay: null,      
                      times: [],       
                      available_days: {start_times: [], end_times: []}    
                    });
                  }
                }
              }
            >
              <option value='0' disabled>Escolha o setor</option>
              {sectorsList}
					  </Input>
					</Row>
				</div>
      </div>
    )
	}

	pickServiceType() {
    const serviceTypeList = (
      this.state.service_types.map((service_type) => {
        return (
          <option value={service_type.id}>{service_type.description}</option>
        )
      })
    )
		return (
			<div className='select-field'>
				<b>2. Escolha o tipo de atendimento:</b>
				<br></br>
				<div>
					<Row className='sector-select'>
					  <Input s={12} l={4} m={12} name="selected_service_type" type='select' value={this.state.selected_service_type} 
              onChange= { 
                (event) => { 
                  if(this.state.selected_service_type != event.target.value) {
                    this.handleInputChange(event); 
                    this.setState({ 
                      update_service_places: 1, 
                      selected_service_place: '0',
                      selectedDay: null, 
                      times: [], 
                      available_days: {start_times: [], end_times: []} 
                    }); 
                  }
                } 
              } 
            >
              <option value='0' disabled>Escolha o tipo de atendimento</option>
              {serviceTypeList}
					  </Input>
					</Row>
				</div>
	        </div>
	    )
	}

	pickServicePlace() {
    const servicePlaceList = (
      this.state.service_places.map((service_place, idx) => {
        return (
          <option value={idx+1}>{service_place.name}</option>
        )
      })
    )
		return (
			<div className='select-field'>
				<b>3. Escolha o local de atendimento:</b>
				<br></br>
				<div>
					<Row className='sector-select'>
            <Input s={12} l={4} m={12} name="selected_service_place" value={this.state.selected_service_place} onChange={ (event) => { this.handleInputChange(event); 
              this.setState({ update_calendar: 1, 
                              selectedDay: null, 
                              times: [], 
                            }); 
            } } s={12} l={4} m={12} type='select'>
              <option value='0' disabled>Escolha o local de atendimento</option>
              {servicePlaceList}
					  </Input>
					</Row>
				</div>
	        </div>
	    )
	}


	confirmButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' onClick={() => this.props.prev()} > Voltar </a>
				<button className="waves-effect btn right" name="commit" type="submit">Continuar</button>
	    	</div>
		)
	}


	scheduleRules() {
		return (
		<li className="collection-item agree-itens">
			<p>Caso efetue o agendamento e não compareça ao local do atendimento no dia e
			horário agendado, uma falta será registrada para você no setor do agendamento
			escolhido.</p>
			<p>Cada setor possui um número máximo de faltas, ultrapassar esse limite dentro
			<b> 90</b> dias irá bloquear que você
			solicite agendamentos pela internet pelos próximos
			<b> 30</b> dias.</p>

			<p>Os setores e seus respectivos limites de faltas estão listados abaixo:</p>
				 		
			{this.sectorList()}
 		</li>

		)
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
    )
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  return {
    user
  }
}
const ScheduleChoose = connect(
  mapStateToProps
)(getScheduleChoose)
export default ScheduleChoose 
