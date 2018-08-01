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
import { Button, Card, Row, Col, Dropdown } from 'react-materialize'
import styles from './styles/ScheduleAgreement.css'
import { browserHistory } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'

class getScheduleAgreement extends Component {

  constructor(props) {
      super(props)
      this.state = {
          sectors: []
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'sectors';
    const params = `permission=${this.props.user.current_role}&citizen_id=${this.props.user.citizen.id}&schedule=true`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ sectors: resp })
    });
  }

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
        <button onClick={this.prev} className="btn waves-effect btn" name="anterior" type="submit">Não concordo</button>
        <button onClick={this.next} className="waves-effect btn right" name="commit" type="submit">Concordar e continuar</button>
      </div>
    )
  }

  prev(e) {
    e.preventDefault()
    browserHistory.push(`/citizens/schedules/history`)
  }

  next(e) {
    e.preventDefault()
    browserHistory.push(`/citizens/schedules/choose`)
  }

  sectorList() {
    const sectorsAbsence = (
      this.state.sectors.map((sector) => {
        return (
          <li>
            - <b>{sector.name}</b>: {sector.absence_max} {sector.absence_max > 1 ? 'faltas' : 'falta'}
          </li>
        )
      })
    )
    return (
      <ul className="sectors_list">
        {sectorsAbsence}
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

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  return {
    user
  }
}
const ScheduleAgreement = connect(
  mapStateToProps
)(getScheduleAgreement)
export default ScheduleAgreement 
