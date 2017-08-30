import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown } from 'react-materialize'
import styles from './styles/ScheduleChoose.css'
import { UserImg } from '../images'
import { browserHistory } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env'
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response"
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'

class ScheduleChoose extends Component {

  constructor(props) {
      super(props)

  }

  mainComponent() {
    return (
      <div className='card'>
          <div className='card-content'>
            <h2 className='card-title h2-title-home'> Agendamento para: </h2>
            <ul className="collection">
              {this.scheduleCitizen()}
            </ul>
            <br></br>
            <ul className="collection">
              {this.scheduleCitizen()}
            </ul>
          </div>
          {this.agreeButton()}
      </div>
    )
  }

  agreeButton() {
    return (
      <div className="card-action">
        <a className='back-bt waves-effect btn-flat'> Voltar </a>
        <button onClick={() =>browserHistory.push(`/citizens/${this.props.user.citizen.id}/schedules/schedule`)} className="waves-effect btn right" name="commit" type="submit">Continuar</button>
      </div>
    )
  }

  scheduleCitizen() {
    return (
      <li className="collection-item avatar">
        <img 
          className="material-icons circle right" 
          src={UserImg} />
        <span className="title"><a href="">Alan Martins de Souza</a></span>
        <p>Data de nascimento: 
          01/01/1993
        </p>
        <p>
          CPF: 
          306.889.437-99
        </p>
      </li>
    )
  }

  scheduleDependents() {
    return (
      <li className="collection-item avatar">
        <span className="title"><a href="">Alan Martins de Souza</a></span>
        <p>Data de nascimento: 
          01/01/1993<br></br>
          CPF: 
          306.889.437-99
        </p>
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