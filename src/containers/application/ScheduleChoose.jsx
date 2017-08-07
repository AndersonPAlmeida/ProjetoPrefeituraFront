import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ScheduleChoose.css'
import DayPicker, { DateUtils } from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import DayPickerInput from 'react-day-picker/DayPickerInput'

class ScheduleChoose extends Component {

	constructor(props) {
	    super(props);
	    this.state = {selectedDays: [new Date(2017, 7, 12), new Date(2017, 7, 2)]};
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
						<Col s={12} l={4} m={12}>
							<div>
								<DayPicker
										className='card-panel'
						          		selectedDays={this.state.selectedDays} 
					          			onDayClick={this.handleDayClick} 
					          		/>
					        </div>
				        </Col>
				        <Col s={12} l={4} m={12}>
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

	pickSector() {
		return (
			<div className='select-field'>
				<b>1. Escolha o setor:</b>
				<br></br>
				<span>
				Se um setor está desabilitado é porque você ultrapassou o número máximo de agendamentos permitidos.
				</span>
				<div>
					<Row className='sector-select'>
					  <Input s={12} l={4} m={12} type='select'>
						<option value='1'>Option 1</option>
						<option value='2'>Option 2</option>
						<option value='3'>Option 3</option>
					  </Input>
					</Row>
				</div>
	        </div>
	    )
	}

	pickServiceType() {
		return (
			<div className='select-field'>
				<b>2. Escolha o tipo de atendimento:</b>
				<br></br>
				<div>
					<Row className='sector-select'>
					  <Input s={12} l={4} m={12} type='select'>
						<option value='1'>Option 1</option>
						<option value='2'>Option 2</option>
						<option value='3'>Option 3</option>
					  </Input>
					</Row>
				</div>
	        </div>
	    )
	}

	pickServicePlace() {
		return (
			<div className='select-field'>
				<b>3. Escolha o local de atendimento:</b>
				<br></br>
				<div>
					<Row className='sector-select'>
					  <Input s={12} l={4} m={12} type='select'>
						<option value='1'>Option 1</option>
						<option value='2'>Option 2</option>
						<option value='3'>Option 3</option>
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
