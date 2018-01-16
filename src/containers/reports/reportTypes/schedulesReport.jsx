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
    this.getSchedulesList = this.getSchedulesList.bind(this)
    this.formatDateTime = this.formatDateTime.bind(this)
    this.getSchedulesIndex = this.getSchedulesIndex.bind(this)

    this.getProfessionals = this.getProfessionals.bind(this)
    this.getShiftPlaces = this.getShiftPlaces.bind(this)
    this.getShiftTypes = this.getShiftTypes.bind(this)
    this.getSituations = this.getSituations.bind(this)
    this.updateFilters = this.updateFilters.bind(this)
    this.clearFields = this.clearFields.bind(this)
  }

  componentWillMount(){
    this.getSchedulesIndex(()=>{
      this.updateFormFields()
    })
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
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = `forms/schedule_index`;
      const params = `permission=${this.props.user.current_role}`
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get"
      }).then(parseResponse).then(resp => {
        console.log(resp)
        this.setState({"schedulesIndex":resp}, () => console.log(this.state))
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
    this.setState({"filterSort":0})
    this.setState({"filterCPF":""})
    this.setState({"filterName":""})
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
        console.log(this.state)
    }
    console.log(this.state)
  }

render() {
    return (
      <div className="contentWrapper">
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
            <Input id="filter6" s={4} label="Ordernar por" type="select" default="0" value={this.state.filterSort} onChange={this.updateFilters}>
              <option value="0">Nome do cidadão</option>
              <option value="1">Situação</option>
              <option value="2">Número do agendamento</option>
            </Input>
            <Input id="filter7" s={4} name='on' label="CPF" value={this.state.filterCPF} onChange={this.updateFilters} />
            <Input id="filter8" s={4} name='on' label="Nome do Cidadão" value={this.state.filterName} onChange={this.updateFilters} />
          </Row>
          </div>
          <Button style={{marginRight:"1rem"}} onClick={this.clearFields}>Limpar Campos</Button>
          {this.state.requestState == "0"
            ?(<Button onClick={this.confirmFilters}>Confirmar filtros</Button>)
            :(<ReportPDF h1="Relatório de Profissionais" h2="" cols={this.state.cols} rows={this.state.rows} filename="relatorio_profissionais.pdf" o='l'/>)
          }
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
