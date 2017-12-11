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
import html2canvas from 'html2canvas';
import styles from './styles/Reports.css';
import { LogoImage } from '../images'
var jsPDF


class getReports extends Component {
  constructor(props) {
    super(props)
    this.state = {
    reportType: 0,
    reportStatus: 0
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
    switch(this.state.reportType){
      case "0":
      browserHistory.push(`/reports/schedules_report`)
        break
      case "1":
        break
      case "2":
        browserHistory.push(`/reports/citizen_report`)
        break
      case "3":
        break
      case "4":
        break
      case "5":
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
