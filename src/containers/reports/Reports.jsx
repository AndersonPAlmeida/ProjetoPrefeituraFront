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

import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env'
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response"

import {Row, Col, Table, Input, Button} from 'react-materialize'
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import styles from './styles/Reports.css';
import { LogoImage } from '../images'
var jsPDF


class getReports extends Component {
  constructor(props) {
    super(props)
    this.state = {
    reportType: "0",
        }
      this.handleDecisionChange = this.handleDecisionChange.bind(this)
      this.confirmReportType = this.confirmReportType.bind(this)

    }

render() {
    return (
      <div className="card selectReport">
        <div className="card-content">
          <h5>Selecione o Tipo de relatório</h5>
          <Row>
          <Input s={6} type='select' label="Tipo do relatório" defaultValue='0' onChange={this.handleDecisionChange}>
                  {this.getReportTypeList().map(function(element){
                      return(<option value={element.value}>{element.name}</option>);
                  })}
          </Input>
          </Row>
          <Button offset="s2" onClick={this.confirmReportType}>Continuar</Button>
        </div>
      </div>
    )
  }

  getReportTypeList(){
    var list = [
      {"value":0,"name":"Agendamentos"},
      {"value":1,"name":"Atendimentos"},
      {"value":2,"name":"Cidadãos"},
      {"value":3,"name":"Escalas"},
      {"value":4,"name":"Número de atendimentos por tipo"},
      {"value":5,"name":"Profissionais"}
    ]
    return(list)
  }

  handleDecisionChange(e){
    this.setState({"reportType":e.target.value})
    console.log(this.state)
  }

  confirmReportType(){
    console.log(this.state.reportType)
    switch(this.state.reportType){
      case "0":
      browserHistory.push(`/reports/schedules_report`)
        break
      case "1":
      browserHistory.push(`/reports/services_report`)
        break
      case "2":
        browserHistory.push(`/reports/citizen_report`)
        break
      case "3":
      browserHistory.push(`/reports/shifts_report`)

        break
      case "4":
        browserHistory.push(`/reports/shift_type_report`)
        break
      case "5":
        browserHistory.push(`/reports/professionals_report`)
        break
      default:
        break
    }

  }
}


const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  return {
    user
  }
}
const Reports = connect(
  mapStateToProps
)(getReports)

export default Reports
