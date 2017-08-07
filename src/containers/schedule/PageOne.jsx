import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, NavItem, Navbar } from 'react-materialize'
import styles from './styles/PageOne.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";

class PageOne extends Component {

	firstComponent() {
		return (
			<div>
				<div className='card'>
          <div className='card-content'>
            <h2 className='card-title h2-title-home'>Bem vindo Administrador MPOG! </h2>
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
            <h2 className='card-title h2-title-home'>Situação de agendamentos </h2>
            <div className={styles['div-component-home']}>
            	<p>Agendamentos por setor: utilizados/máximo</p>
            	<p>Setor de Agendamento MPOG: 0/10  </p>
            </div>
          </div>
		    </div>
			</div>
		)
	}	

	thirdComponent() {
		return (
			<div>
				<div className='card'>
          <div className='card-content'>
            <h2 className='card-title h2-title-home'>Histórico de agendamentos </h2>
            <div className={styles['div-component-home']}>
            	<p>Agendamentos podem ser cancelados em até hora(s) antes do horário de início do atendimento.</p>
            </div>
          </div>
		    </div>
			</div>
		)
	}

	fourthComponent() {
		return (
			<div>
				<div className='card'>
          <div className='card-content'>
            <h2 className='card-title h2-title-home'>Buscar agendamentos </h2>
            <div className={styles['div-component-home']}>
            	<p>Agendamentos podem ser cancelados em até hora(s) antes do horário de início do atendimento.</p>
            </div>
          </div>
		    </div>
			</div>
		)
	}

  render() {
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'citizens';
    fetch(`${apiUrl}/${collection}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      console.log(resp);
    });
    return (
      <div> 
	      <main>
	      	<Row>
		        <Col s={12}>
			      	<div>
			      		{this.firstComponent()}
			      		{this.secondComponent()}
			      		{this.thirdComponent()}
			      		{this.fourthComponent()}
			      	</div>
		      	</Col>
		    </Row>
		  </main>
      </div>
    )
  }
}

export default PageOne 