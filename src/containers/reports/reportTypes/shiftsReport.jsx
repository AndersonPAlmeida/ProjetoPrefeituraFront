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
import styles from './styles/shiftsReport.css'
import ReportPDF from '../reportPDF'

class getShiftsReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shiftsList: [],
      shiftIndex: [],
      rows:[],
      cols:[],
      requestState:0,

      filterSort:-1,
      filterServicePlace:-1,
      filterShiftType:-1,
      filterProfessional:-1
    }
    this.getShiftIndex = this.getShiftIndex.bind(this)
    this.updateFilters = this.updateFilters.bind(this)
    this.formatDateTime = this.formatDateTime.bind(this)
    this.clearFields = this.clearFields.bind(this)
    this.confirmFilters = this.confirmFilters.bind(this)
    this.arrangeData = this.arrangeData.bind(this)
  }

  componentWillMount(){
    this.getShiftIndex()
  }

getShiftIndex(){
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `forms/shift_index`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get"
    }).then(parseResponse).then(resp => {
      console.log(resp)
      this.setState({"shiftIndex":resp}, () => console.log(this.state))
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
confirmFilters(){
    var filters = ''
    if(this.state.filterServicePlace != -1){
      filters = filters + `&q[service_place_id]=${this.state.filterServicePlace}`
      console.log("place")
    }
    if(this.state.filterProfessional != -1){
      filters = filters + `&q[professional]=${this.state.filterProfessional}`
      console.log("prof")
    }
    if(this.state.filterShiftType != -1){
      filters = filters + `&q[service_type_id]=${this.state.filterShiftType}`
      console.log("type")
    }
    if(this.state.filterSort != -1){
      filters = filters + `&q[s]=${this.state.filterSort}+asc`
      console.log("sort")
    }

    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `shifts`;
    const params = `permission=${this.props.user.current_role}${filters}`
    console.log(params)
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get"
    }).then(parseResponse).then(resp => {
      this.setState({"shiftsList":resp}, () => this.arrangeData())
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
  console.log(this.state.shiftsList)
  var protoRows = []
  var i
  var current
  for(i = 0; i < this.state.shiftsList.num_entries; i++){
    current = this.state.shiftsList.entries[i]
    protoRows.push([current.id, current.service_type_description,  current.service_place_name, current.professional_performer_name, this.formatDateTime(current.execution_start_time)])
   }
  this.setState({ cols: ["ID", "Tipo de Serviço", "Local do serviço", "Nome do profissional", "Data de Início"] })
  this.setState({rows:protoRows})
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
    if(this.state.shiftIndex.service_places == null){
      return([])
    }else{
      return(this.state.shiftIndex.service_places)
    }
  }

  getProfessionals(){
    if(this.state.shiftIndex.professionals == null){
      return([])
    }else{
      return(this.state.shiftIndex.professionals)
    }
  }
  getShiftTypes(){
    if(this.state.shiftIndex.service_types == null){
      return([])
    }else{
      return(this.state.shiftIndex.service_types)
    }
  }
  clearFields(){
    this.setState({"filterServicePlace":-1})
    this.setState({"filterProfessional":-1})
    this.setState({"filterServiceType":-1})
    this.setState({"filterSort":-1})
    this.setState({requestState:0})
    this.setState({"shiftsList":[]})
    this.setState({"cols":[]})
    this.setState({"rows":[]})
  }

  updateFilters(e){
    switch(e.target.id){
      case "filter0":
        this.setState({"filterServicePlace":e.target.value})
        break;
      case "filter1":
        this.setState({"filterProfessional":e.target.value})
        break;
      case "filter2":
        this.setState({"filterServiceType":e.target.value})
        break;
      case "filter3":
        this.setState({"filterSort":e.target.value})
        break;
      default:
        break;
        console.log(this.state)
    }
    this.setState({requestState:0})
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
              <option value="-1">Nenhum filtro</option>
              {this.getShiftPlaces().map(function(element,i){
                return(<option key={i} value={element.id}>{element.name}</option>)
              })}
            </Input>

            <Input id="filter1" s={4} label="Profissional" type="select" default="-1" value={this.state.filterProfessional} onChange={this.updateFilters}>
              <option value="-1">Nenhum filtro</option>
              {this.getProfessionals().map(function(element,i){
                return(<option key={i} value={element.id}>{element.name}</option>)
              })}
            </Input>

            <Input id="filter2" s={4} label="Tipo de atendimento" type="select" default="-1" value={this.state.filterServiceType} onChange={this.updateFilters}>
              <option value="-1">Nenhum filtro</option>
              {this.getShiftTypes().map(function(element,i){
                return(<option key={i} value={element.id}>{element.description}</option>)
              })}
            </Input>
          </Row>
          <Row>
            <Input id="filter3" s={4} label="Ordenar Por" type="select" default="-1" value={this.state.filterSort} onChange={this.updateFilters}>
              <option value="-1">Nenhum</option>
              <option value="service_type_description"> Descrição</option>
              <option value="service_place_name"> Local de Atendimento</option>
              <option value="execution_start_time"> Horário de Inicio</option>
            </Input>
          </Row>


          </div>
          <Button style={{marginRight:"1rem"}} onClick={this.clearFields}>Limpar Campos</Button>
          {this.state.requestState == "0"
            ?(<Button onClick={this.confirmFilters}>Confirmar filtros</Button>)
            :(<ReportPDF h1="Relatório de Escalas" h2="" cols={this.state.cols} rows={this.state.rows} filename="relatorio_escalas.pdf" o='l'/>)
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
const shiftsReport = connect(
  mapStateToProps
)(getShiftsReport)

export default shiftsReport
