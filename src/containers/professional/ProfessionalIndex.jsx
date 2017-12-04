import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input, Collapsible, CollapsibleItem, Pagination } from 'react-materialize'
import styles from './styles/ProfessionalIndex.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import strftime from 'strftime'

class getProfessionalIndex extends Component {
  constructor(props) {
      super(props)
  }

	firstComponent() {
		return (
			<div>
				<div className='card'>
          <div className='card-content'>
            <h2 className='card-title h2-title-home'>Bem vindo {this.props.user.citizen.name}! </h2>
            <div className={styles['div-component-home']}>
            	<p>Abaixo, você poderá visualizar o histórico, com seus agendamentos marcados, 
            			efetuados e cancelados, podendo verificar também a possibilidade de realizar novos agendamentos.</p>
            	<p>Para mais informações sobre como usar o Sistema Agendador de Serviços Públicos 
            			visite o Manual de Utilização ou a seção de Perguntas Frequentes. </p>
            </div>
          </div>
		    </div>
			</div>
		)
	}	

	secondComponent() {
		return (
			<div>
				<div className='card'>
          <div className='card-content'>
            <h2 className='card-title h2-title-home'></h2>
            <div className={styles['div-component-home']}>
            </div>
          </div>
		    </div>
			</div>
		)
	}	

  render() {
    return (
      <div> 
	      <main>
	      	<Row>
		        <Col s={12}>
			      	<div>
			      		{this.firstComponent()}
			      		{this.secondComponent()}
			      	</div>
		      	</Col>
		    </Row>
		  </main>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  return {
    user
  }
}

const ProfessionalIndex = connect(
  mapStateToProps
)(getProfessionalIndex)
export default ProfessionalIndex

