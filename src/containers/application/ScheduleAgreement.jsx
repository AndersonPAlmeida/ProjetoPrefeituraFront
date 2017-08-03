import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown } from 'react-materialize'
import styles from './styles/ScheduleAgreement.css'
import { browserHistory } from 'react-router'

class ScheduleAgreement extends Component {

	mainComponent() {
		return (
			<div className='card'>
	          <div className='card-content'>
	            <h2 className='card-title h2-title-home'> Passo 1 de 3 - Termo de Compromisso </h2>
	            <ul className="collection">
					{this.scheduleRules()}
			 	</ul>
	          </div>
	          {this.agreeButton()}
	    	</div>
		)
	}

	agreeButton() {
		return (
			<div className="card-action">
				<button className="btn waves-effect btn" name="anterior" type="submit">Não concordo</button>
				<button onClick={() =>browserHistory.push('/schedule_choose')} className="waves-effect btn right" name="commit" type="submit">Concordar e continuar</button>
	    	</div>
		)
	}

	sectorList() {
		return (
			<ul className="sectors_list">
			    <li>
			      - <b>Setor da Saúde</b>: 1 falta.
			    </li>
			</ul>
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

export default ScheduleAgreement 
