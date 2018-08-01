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
import { port, apiHost, apiPort, apiVer } from '../../../../config/env'
import {parseResponse} from "../../../redux-auth/utils/handle-fetch-response"
import {Row, Col, Table, Input, Button, Card} from 'react-materialize'
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
      schedulesIndex:[],
      requestState:0,

      filterServicePlace:-1,
      filterStartDate:"",
      filterEndDate:"",
      filterProfessional:-1,
      filterServiceType:-1,
      filterSituation:-1,
      filterSort:0,
      filterCPF:"",
      filterName:""
    }
    this.formatDateTime = this.formatDateTime.bind(this)
    this.getSchedulesIndex = this.getSchedulesIndex.bind(this)

    this.getProfessionals = this.getProfessionals.bind(this)
    this.getShiftPlaces = this.getShiftPlaces.bind(this)
    this.getShiftTypes = this.getShiftTypes.bind(this)
    this.getSituations = this.getSituations.bind(this)
    this.updateFilters = this.updateFilters.bind(this)
    this.clearFields = this.clearFields.bind(this)
    this.arrangeData = this.arrangeData.bind(this)
    this.confirmFilters = this.confirmFilters.bind(this)
  }

  componentWillMount(){
    this.getSchedulesIndex(()=>{
      this.updateFormFields()
    })
  }



  formatDate(date){
    return(date[8] + date[9] + '/' + date[5] + date[6] + '/' + date[0] + date[1] + date[2] + date[3])
  }

  formatDateTime(dateTime){
    var dateText = new Date(dateTime)
    var returnText = this.addZeroBefore(dateText.getHours()) + ":" + this.addZeroBefore(dateText.getMinutes()) + " - " + dateText.getDate() + "/" + (dateText.getMonth() + 1) + "/" + dateText.getFullYear()

    return(returnText)
  }

  addZeroBefore(time){
    var newTime = time.toString()
    if(newTime.length == 1){
      newTime = "0" + time
    }
    return(newTime)
  }

  getSchedulesIndex(){
      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
      const collection = `forms/schedule_index`;
      const params = `permission=${this.props.user.current_role}`
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get"
      }).then(parseResponse).then(resp => {

        this.setState({"schedulesIndex":resp})
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

  updateFormFields(){
    this.getProfessionals()
    this.getShiftPlaces()
    this.getShiftTypes()
    this.getSituations()
  }
  getShiftPlaces(){
    if(this.state.schedulesIndex.service_places == null){
      return([])
    }else{
      return(this.state.schedulesIndex.service_places)
    }
  }
  getProfessionals(){
    if(this.state.schedulesIndex.professionals == null){
      return([])
    }else{
        return(this.state.schedulesIndex.professionals)
    }
  }
  getShiftTypes(){
    if(this.state.schedulesIndex.service_types == null){
      return([])
    }else{
      return(this.state.schedulesIndex.service_types)
    }
  }
  getSituations(){
    if(this.state.schedulesIndex.situation == null){
      return([])
    }else{
      return(this.state.schedulesIndex.situation)
    }
  }
  clearFields(){
    this.setState({"filterServicePlace":-1})
    this.setState({"filterStartDate":""})
    this.setState({"filterEndDate":""})
    this.setState({"filterProfessional":-1})
    this.setState({"filterServiceType":-1})
    this.setState({"filterSituation":-1})
    this.setState({"filterSort":-1})
    this.setState({"filterCPF":""})
    this.setState({"filterName":""})

    this.setState({"requestState":0})
  }
  updateFilters(e){
    switch(e.target.id){
      case "filter0":
        this.setState({"filterServicePlace":e.target.value})
        break;
      case "filter1":
        this.setState({"filterStartDate":e.target.value})
        break;
      case "filter2":
        this.setState({"filterEndDate":e.target.value})
        break;
      case "filter3":
        this.setState({"filterProfessional":e.target.value})
        break;
      case "filter4":
        this.setState({"filterServiceType":e.target.value})
        break;
      case "filter5":
        this.setState({"filterSituation":e.target.value})
        break;
      case "filter6":
        this.setState({"filterSort":e.target.value})
        break;
      case "filter7":
        this.setState({"filterCPF":e.target.value})
        break;
      case "filter8":
        this.setState({"filterName":e.target.value})
        break;
      default:
        break;
    }
    this.setState({"requestState":0})
  }
  confirmFilters(){
      var filters = ''
      if(this.state.filterOrder != null){
        filters = filters + `&q[s]=${this.state.filterOrder}+asc`

      }
      if(this.state.filterProfessional != -1){
        filters = filters + `&q[professional]=${this.state.filterProfessional}`

      }
      if(this.state.filterCPF != ""){
        filters = filters + `&q[cpf]=${this.state.filterCPF}`

      }
      if(this.state.filterServicePlace != -1){
        filters = filters + `&q[service_places]=${this.state.filterServicePlace}`

      }
      if(this.state.filterServiceType != -1){
        filters = filters + `&q[service_type]=${this.state.filterServiceType}+asc`

      }
      if(this.state.filterStartDate != ""){
        filters = filters + `&q[start_time]=${this.state.filterStartDate}`

      }
      if(this.state.filterEndDate != ""){
        filters = filters + `&q[end_time]=${this.state.filterEndDate}`

      }
      if(this.state.filterName != ""){
        filters = filters + `&q[name]=${this.state.filterName}`

      }

      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
      const collection = `schedules`;
      const params = `permission=${this.props.user.current_role}${filters}`

      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get"
      }).then(parseResponse).then(resp => {
        this.setState({"schedulesList":resp}, () => this.arrangeData())
      }).catch(({errors}) => {
        if(errors) {
          let full_error_msg = "";
          errors.forEach(function(elem){ full_error_msg += elem + '\n' });
          Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
          throw errors;
          }
        }
      )

    this.setState({"requestState":1})
  }

  arrangeData(){
    var protoRows = []
    var i
    var current
    for(i = 0; i< this.state.schedulesList.num_entries; i++){
      current = this.state.schedulesList.entries[i]
       protoRows.push([current.id, current.service_type,  current.situation_description, current.professional_name, current.professional_performer_id, this.formatDateTime(current.service_start_time), this.formatDateTime(current.service_end_time) ,current.citizen_name, current.citizen_cpf ])
          }
    this.setState({"cols":["ID", "Tipo de Serviço", "Situação", "Nome do profissional", "ID Profissional", "Horário de Início", "Horário de Fim", "Nome do cidadão", "CPF do cidadão"]})
    this.setState({"rows":protoRows})
  }

render() {
    return (
      <div className="contentWrapper">
        <Card>
        <h5>Filtros do relatório</h5>
          <div>
            <br/>
            <Row>
            <Input id="filter0" s={4} label="Local do Atendimento" type="select" default="-1" value={this.state.filterServicePlace} onChange={this.updateFilters}>
              <option value="-1">Nenhum</option>
              {this.getShiftPlaces().map(function(element,i){
                return(<option key={i} value={element.id}>{element.name}</option>)
              })}
            </Input>
            <Input id="filter1" s={4} name='on' type='date' label="Data de Início" value={this.state.filterStartDate} onChange={this.updateFilters} />
            <Input id="filter2" s={4} name='on' type='date' label="Data de Fim" value={this.state.filterEndDate} onChange={this.updateFilters}/>
          </Row>
          <Row>

            <Input id="filter3" s={4} label="Profissional" type="select" default="-1" value={this.state.filterProfessional} onChange={this.updateFilters}>
              <option value="-1">Nenhum</option>
                {this.getProfessionals().map(function(element,i){
                  return(<option key={i} value={element.id}>{element.name}</option>)
                })}
              </Input>

            <Input id="filter4" s={4} label="Tipo de atendimento" type="select" default="-1" value={this.state.filterServiceType} onChange={this.updateFilters}>
              <option value="-1" >Nenhum</option>
              {this.getShiftTypes().map(function(element,i){
                return(<option key={i} value={element.id}>{element.description}</option>)
              })}
            </Input>

            <Input id="filter5" s={4} label="Situação" type="select" default="-1" value={this.state.filterSituation} onChange={this.updateFilters}>
              <option value="-1">Nenhum</option>
              {this.getSituations().map(function(element,i){
                return(<option key={i} value={element.id}>{element.description}</option>)
              })}
            </Input>
          </Row>

          <Row>
            <Input id="filter6" s={4} label="Ordernar por" type="select" default="-1" value={this.state.filterSort} onChange={this.updateFilters}>
                <option value="-1">Nenhum</option>
                <option value="citizen_name">Nome do cidadão  </option>
                <option value="citizen_cpf">CPF</option>
                <option value="service_start_time">Horário de inicio</option>
                <option value="service_place_name">Local de atendimento</option>
                <option value="shift_service_type_name">Tipo de atendimento</option>
                <option value="situation_description">Situação</option>

            </Input>
            <Input id="filter7" s={4} name='on' label="CPF" value={this.state.filterCPF} onChange={this.updateFilters} />
            <Input id="filter8" s={4} name='on' label="Nome do Cidadão" value={this.state.filterName} onChange={this.updateFilters} />
          </Row>
          </div>
          <Button style={{marginRight:"1rem"}} onClick={this.clearFields}>Limpar Campos</Button>
          {this.state.requestState == "0"
            ?(<Button onClick={this.confirmFilters}>Confirmar filtros</Button>)
            :(<ReportPDF h1="Relatório de Agendamentos" h2="" cols={this.state.cols} rows={this.state.rows} filename="relatorio_agendamentoss.pdf" o='l'/>)
          }
        </Card>
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
