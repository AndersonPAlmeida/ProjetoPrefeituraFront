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
import styles from './styles/ScheduleChoose.css'
import { UserImg } from '../images'
import { browserHistory } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env'
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response"
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'

class getScheduleChoose extends Component {

  constructor(props) {
      super(props)
      this.state = {
          dependants: [],
          citizen: {
                     name: '',
                     cpf: '',
                     id: ''
                   }
      };
  }

  componentDidMount() {
    var self = this;

    if(this.props.professional_page) {
      self.setState({
        dependants: this.props.dependants,
        citizen: this.props.citizen
      })
    }
    else {
      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
      const collection = `citizens/schedule_options`;
      const params = `permission=${this.props.user.current_role}&cpf=${this.props.user.citizen.cpf}`
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get",
      }).then(parseResponse).then(resp => {
        let citizen
        for(var i = 0; i < resp.length; i++)
          if(resp[i].cpf == this.props.user.citizen.cpf) {
            citizen = resp[i]
            resp.splice(i, 1)
          }
        self.setState({ 
          dependants: resp,
          citizen: citizen
        })
      });
    }
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
            
              {this.scheduleDependants()}
            
          </div>
          {this.goBackButton()}
      </div>
    )
  }

  goBackButton() {
    return (
      <div className="card-action">
        <a className='back-bt waves-effect btn-flat' href='#' onClick={this.prev} > Voltar </a>
      </div>
    )
  }

  prev(e) {
    e.preventDefault()
    browserHistory.push(`/citizens/schedules/agreement`)
  }

  formatCPF(n) {
    n = n.replace(/\D/g,"");
    n = n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})$/,"$1.$2.$3-$4");
    return (n);
  }

  scheduleCitizen() {
    var current_citizen = this.state.citizen
    var d, date;
    d = new Date(current_citizen.birth_date)
    date = this.addZeroBefore(d.getDate()) + "/" + this.addZeroBefore(d.getMonth()+1) + "/" + this.addZeroBefore(d.getFullYear())
    return (
      <li className="collection-item avatar">
        <img 
          className="material-icons circle right" 
          src={UserImg} />
        <span className="title"><a href='#' onClick={() => browserHistory.push(`/citizens/${current_citizen.id}/schedules/schedule`)} > {current_citizen.name} </a></span>
        <p>Data de nascimento: {date}
        </p>
        <p>
          CPF: {this.formatCPF(current_citizen.cpf)}
        </p>
      </li>
    )
  }

  addZeroBefore(n) {
    return (n < 10 ? '0' : '') + n;
  }

  formatRG(n) {
    n = n.replace(/\D/g,"");
    n = n.replace(/(\d{2})(\d{3})(\d{3})(\d{1})$/,"$1.$2.$3-$4");
    return (n);
  }

  scheduleDependants() {
    var d, date;
    const listDependants = (
      this.state.dependants.map((dependant) => {
        d = new Date(dependant.birth_date)
        date = this.addZeroBefore(d.getDate()) + "/" + this.addZeroBefore(d.getMonth()+1) + "/" + this.addZeroBefore(d.getFullYear())
        return (
          <li className="collection-item avatar">
            <img 
              className="material-icons circle right" 
              src={UserImg} />
            <span className="title"><a href='#' onClick={() =>browserHistory.push(`/citizens/${dependant.id}/schedules/schedule`)} >{dependant.name}</a></span>
            <p>Data de nascimento: {date}<br></br>
              RG: {this.formatRG(dependant.rg)}
            </p>
          </li>
        )
      })
    )
    return (
      <ul className="collection">
        {listDependants}
      </ul>
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
const ScheduleChoose = connect(
  mapStateToProps
)(getScheduleChoose)
export default ScheduleChoose
