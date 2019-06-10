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
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/SectorShow.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';

class getSectorShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sector: {
        active: '',
        absence_max: '',
        blocking_days: '',
        cancel_limt: '',
        description: '',
        name: '',
        previous_notice: '',
        schedules_by_sector: ''
      },
    }
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `sectors/${this.props.params.sector_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ sector: resp })
    });
  }

  mainComponent() {
    return (
      <div className='card'>
            <div className='card-content'>
              <h2 className='card-title h2-title-home'> Informações do Setor: </h2>
              <p> 
                <b>Situação: </b>
                {this.state.sector.active ? 'Ativo' : 'Inativo'}
              </p>
              <p> 
                <b>Nome: </b>
                {this.state.sector.name}
              </p>
              <p> 
                <b>Descrição: </b>
                {this.state.sector.description}
              </p>
              <p> 
                <b>Número de Agendamentos por Setor: </b>
                {this.state.sector.schedules_by_sector}
              </p>
              <p> 
                <b>Número de dias de impedimento de novos agendamentos: </b>
                {this.state.sector.blocking_days}
              </p>
              <p> 
                <b>Limite de cancelamentos: </b>
                {this.state.sector.cancel_limit}
              </p>
              <p> 
                <b>Horas de antecedência para poder cancelar um atendimento: </b>
                {this.state.sector.previous_notice}
              </p>
              <p> 
                <b>Número de faltas que gera impedimento de novos agendamentos: </b>
                {this.state.sector.absence_max}
              </p>
            </div>
            {this.editButton()}
        </div>
    )
  }

  editSector () {
    browserHistory.push(`sectors/${this.props.params.sector_id}/edit`)
  }

  prev() {
    browserHistory.push(`sectors`)
  }  

	editButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
				<button className="waves-effect btn right" name="commit" onClick={this.editSector.bind(this)} type="submit">Editar</button>
      </div>
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
const SectorShow = connect(
  mapStateToProps
)(getSectorShow)
export default SectorShow
