import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../../config/env'
import {parseResponse} from "../../../redux-auth/utils/handle-fetch-response"
import {Row, Col, Table, Input, Button} from 'react-materialize'
import {fetch} from "../../../redux-auth";
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import styles from './styles/schedulesReport.css'
import ReportPDF from '../reportPDF'


class getSchedulesReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      schedulesList: [],
      schedulesIndex:[]
    }
    this.getSchedulesList = this.getSchedulesList.bind(this)
    this.formatDateTime = this.formatDateTime.bind(this)
  }

  componentDidMount(){
    this.getSchedulesIndex()
  }

  getSchedulesIndex(){
    //return index of schedules from backend and set state
  }


getSchedulesList(){
  const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `schedules`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get"
    }).then(parseResponse).then(resp => {
      this.setState({"schedulesList":resp}, () => console.log(this.state))
    }).catch(({errors}) => {
      if(errors) {
        let full_error_msg = "";
        errors.forEach(function(elem){ full_error_msg += elem + '\n' });
        Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
        throw errors;
        }
      }
    )
}

  formatDate(date){
    return(date[8] + date[9] + '/' + date[5] + date[6] + '/' + date[0] + date[1] + date[2] + date[3])
  }

  formatDateTime(dateTime){
    var dateText = new Date(dateTime)
    var returnText = this.addZeroBefore(dateText.getHours()) + ":" + this.addZeroBefore(dateText.getMinutes()) + " - " + dateText.getDate() + "/" + (dateText.getMonth() + 1) + "/" + dateText.getFullYear()
    //console.log(returnText)
    return(returnText)
  }

  addZeroBefore(time){
    var newTime = time.toString()
    if(newTime.length == 1){
      newTime = "0" + time
    }
    return(newTime)
  }

  getShiftPlaces(){
    return(["A","B","C","D","E"])
  }

  getProfessionals(){
    return(["A","B","C","D","E"])
  }
  getShiftTypes(){
    return(["A","B","C","D","E"])
  }

  getSituations(){
    return(["A","B","C","D","E"])
  }

render() {
    return (
      <div className="contentWrapper">
        <h5>Filtros do relatório</h5>
          <div>
            <br/>
            <Row>
            <Input s={4} label="Local do Atendimento" type="select" default="0">
              {this.getShiftPlaces().map(function(element,i){
                return(<option key={i} value={i}>{element}</option>)
              })}
            </Input>

            <Input s={4} name='on' type='date' label="Data de Início" onChange={function(e, value) {}} />
            <Input s={4} name='on' type='date' label="Data de Fim" onChange={function(e, value) {}} />
          </Row>

          <Row>
            <Input s={4} label="Profissional" type="select" default="0">
              {this.getProfessionals().map(function(element,i){
                return(<option key={i} value={i}>{element}</option>)
              })}
            </Input>

            <Input s={4} label="Tipo de atendimento" type="select" default="0">
              {this.getShiftTypes().map(function(element,i){
                return(<option key={i} value={i}>{element}</option>)
              })}
            </Input>

            <Input s={4} label="Situação" type="select" default="0">
              {this.getSituations().map(function(element,i){
                return(<option key={i} value={i}>{element}</option>)
              })}
            </Input>
          </Row>

          <Row>
            <Input s={4} label="Ordernar por" type="select" default="0">
              <option value="0">Nome do cidadão</option>
              <option value="1">Situação</option>
              <option value="2">Número do agendamento</option>
            </Input>
            <Input s={4} name='on' type='date' label="CPF" onChange={function(e, value) {}} />
            <Input s={4} name='on' type='date' label="Nome do Cidadão" onChange={function(e, value) {}} />
          </Row>
          </div>
          <Button style={{marginRight:"1rem"}}>Limpar Campos</Button>
          <ReportPDF h1="Relatório de Agendamentos" h2="" cols={[]} rows={[]} filename="relatorio_agendamentos.pdf" />
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
const schedulesReport = connect(
  mapStateToProps
)(getSchedulesReport)

export default schedulesReport
