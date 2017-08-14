import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ScheduleChoose.css'
import DayPicker, { DateUtils } from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julia', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const WEEKDAYS_LONG = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const WEEKDAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

class ScheduleChoose extends Component {

  constructor(props) {
      super(props)
      this.state = {
          selected_sector: '0',
          selected_service_type: '0',
          selected_service_place: '0',
          update_service_types: 0,
          update_service_places: 0,
          update_calendar: 0,
          sectors: [],
          service_types: [],
          service_places: [],
          selectedDays: [new Date(2017, 7, 12), new Date(2017, 7, 2)]
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'sectors';
    fetch(`${apiUrl}/${collection}`, {
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
      fetch(`${apiUrl}/${collection}`, {
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
      fetch(`${apiUrl}/${collection}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get",
      }).then(parseResponse).then(resp => {
        this.setState({ service_places: resp })
        this.setState({ update_service_places: 0 })
      }); 
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

	handleDayClick = (day, { selected }) => {
	    const { selectedDays } = this.state;
	    if (selected) {
	      const selectedIndex = selectedDays.findIndex(selectedDay =>
	        DateUtils.isSameDay(selectedDay, day)
	      );
	      selectedDays.splice(selectedIndex, 1);
	    } else {
	      selectedDays.push(day);
	    }
	    this.setState({ selectedDays });
	  };



	calendarComponent() {
		return (
			<div>
				<div className='select-field'>
					<b>4. Escolha o tipo de atendimento:</b>
					<br></br>
					<Row>
						<Col>
							<div>
								<DayPicker
										locale="pt"
								        months={MONTHS}
								        weekdaysLong={WEEKDAYS_LONG}
								        weekdaysShort={WEEKDAYS_SHORT}
										className='card-panel'
						          		selectedDays={this.state.selectedDays} 
					          			onDayClick={this.handleDayClick} 
					          		/>
					        </div>
				        </Col>
				        <Col>
				          	<div className='card-panel'>
					          	<b>Horários disponíveis na data selecionada </b>
								<br></br>
				          		<Row className='sector-select'>
								  <Input type='select'>
									<option value='1'>Option 1</option>
									<option value='2'>Option 2</option>
									<option value='3'>Option 3</option>
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
					  <Input name="selected_sector" value={this.state.selected_sector} onChange={ (event) => { this.handleInputChange(event); this.setState({ update_service_types: 1, selected_service_type: '0', selected_service_place: '0' }); } } s={12} l={4} m={12} type='select'>
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
					  <Input s={12} l={4} m={12} name="selected_service_type" value={this.state.selected_service_type} onChange={ (event) => { this.handleInputChange(event); this.setState({ update_service_places: 1, selected_service_place: '0' }); } } s={12} l={4} m={12} type='select'>
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
      this.state.service_places.map((service_place) => {
        return (
          <option value={service_place.id}>{service_place.name}</option>
        )
      })
    )
		return (
			<div className='select-field'>
				<b>3. Escolha o local de atendimento:</b>
				<br></br>
				<div>
					<Row className='sector-select'>
            <Input s={12} l={4} m={12} name="selected_service_place" value={this.state.selected_service_place} onChange={ (event) => { this.handleInputChange(event); this.setState({ update_calendar: 1 }); } } s={12} l={4} m={12} type='select'>
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
      <div>
	      <main>
	      	<Row>
		        <Col s={12}>
			      	<div>
			      		{this.mainComponent()}
			      	</div>
		      	</Col>
		    </Row>
		  </main>
      </div>
    )
  }
}

export default ScheduleChoose 
