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
import styles from './styles/professionalsReport.css'
import ReportPDF from '../reportPDF'


class getProfessionalsReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      professionalsList: [],
      professionalsIndex:[],
      requestState:0,

      filterOccupation:null,
      filterServicePlace:null,
      filterPermission:null,
      filterOrder:null,
      rows:[],
      cols:[]
    }
    this.confirmFilters = this.confirmFilters.bind(this)
    this.clearFields = this.clearFields.bind(this)
    this.updateFormFields = this.updateFormFields.bind(this)
    this.getJobs = this.getJobs.bind(this)
    this.getShiftPlaces = this.getShiftPlaces.bind(this)
    this.getPermission = this.getPermission.bind(this)
    this.updateFilters = this.updateFilters.bind(this)
    this.arrangeData = this.arrangeData.bind(this)
  }

  componentWillMount(){
    this.getProfessionalsIndex(()=>{
      this.updateFormFields()
    })
  }

  getProfessionalsIndex(){
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = `forms/professional_index`;
      const params = `permission=${this.props.user.current_role}`
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get"
      }).then(parseResponse).then(resp => {
        this.setState({"professionalsIndex":resp}, () => console.log(resp))
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
    this.getJobs()
    this.getShiftPlaces()
    this.getPermission()
  }


  arrangeList(list){
    var i
    var returnText = list[0]
    for(i = 1; i < list.length; i++){
      returnText = returnText + ", " + list[i]
    }
    return(returnText)
  }

  getJobs(){
    if(this.state.professionalsIndex.occupations == null){
      return([])
    }else{
      return(this.state.professionalsIndex.occupations)
    }
  }

  getShiftPlaces(){
    if(this.state.professionalsIndex.service_places == null){
      return([])
    }else{
      return(this.state.professionalsIndex.service_places)
    }
  }
  getPermission(){
    if(this.state.professionalsIndex.permissions == null){
      return([])
    }else{
      return(this.state.professionalsIndex.permissions)
    }
  }

  arrangeData(){
    var protoRows = []
    var i
    var current
    for(i = 0; i< this.state.professionalsList.num_entries; i++){
      current = this.state.professionalsList.entries[i]
      protoRows.push([current.name, current.registration, current.occupation_name, current.cpf, current.email, current.phone1, this.arrangeList(current.roles_names)])
          }
    this.setState({"cols":["Nome", "Registro", "Cargo", "CPF", "Email", "Telefone", "Funções"]})
    this.setState({"rows":protoRows})

  }
  confirmFilters(){
      var filters = ''
      if(this.state.filterOrder != null){
        filters = filters + `&q[s]=${this.state.filterOrder}+asc`
        console.log("ord")
      }
      if(this.state.filterPermission != null){
        filters = filters + `&q[role]=${this.state.filterPermission}`
        console.log("perm")
      }
      if(this.state.filterOccupation != null){
        filters = filters + `&q[occupation]=${this.state.filterOccupation}`
        console.log("occup")
      }
      if(this.state.filterServicePlace != null){
        filters = filters + `&q[service_places]=${this.state.filterServicePlace}`
        console.log("place")
      }

      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = `professionals`;
      const params = `permission=${this.props.user.current_role}${filters}`
      console.log(params)
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get"
      }).then(parseResponse).then(resp => {
        this.setState({"professionalsList":resp}, () => this.arrangeData())
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

  clearFields(){
    this.setState({"requestState":0,
      filterOrder:null,
      filterOccupation:null,
      filterPermission:null,
      filterServicePlace:null
    })
  }

  updateFilters(e){
    switch(e.target.id){
      case "filter0":
        this.setState({"filterOccupation":e.target.value})
        break;
      case "filter1":
        this.setState({"filterServicePlace":e.target.value})
        break;
      case "filter2":
        this.setState({"filterPermission":e.target.value})
        break;
      case "filter3":
        this.setState({"filterOrder":e.target.value})
        break;
      default:
        break;
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
            <Input id="filter0" s={4} label="Cargo" type="select" default="0" onChange={this.updateFilters}>
              <option value={[]}>Nenhum</option>
              {this.getJobs().map(function(element,i){
                return(<option key={i} value={element.id}>{element.name}</option>)
              })}
            </Input>
            <Input id="filter1" s={4} label="Local do Atendimento" type="select" default="0" onChange={this.updateFilters}>
              <option value={[]}>Nenhum</option>
              {this.getShiftPlaces().map(function(element,i){
                return(<option key={i} value={element.id}>{element.name}</option>)
              })}
            </Input>

            <Input id="filter2" s={4} label="Permissão" type="select" default="0" onChange={this.updateFilters}>
              <option value={[]}>Nenhum</option>
              {this.getPermission().map(function(element,i){
                return(<option key={i} value={element.role}>{element.name}</option>)
              })}
            </Input>
          </Row>

          <Row>
            <Input id="filter3" s={6} label="Ordernar por" type="select" default="0" onChange={this.updateFilters}>
              <option value={[]}>Nenhum</option>
              <option value="name">Nome</option>
              <option value="occupation_name">Ocupação</option>
            </Input>
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
const professionalsReport = connect(
  mapStateToProps
)(getProfessionalsReport)

export default professionalsReport
