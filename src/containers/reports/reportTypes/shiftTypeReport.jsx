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
import styles from './styles/shiftTypeReport.css'
import ReportPDF from '../reportPDF'


class getshiftTypeReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      serviceTypeList: [],
      cityHalls:[],
      requestState:0,
      filterStartDate:'',
      filterEndDate:'',
      filterCityHall:-1,
    }
    this.returnShiftTypeList = this.returnShiftTypeList.bind(this)
    this.clearFields = this.clearFields.bind(this)
    this.updateFilters = this.updateFilters.bind(this)
    this.arrangeData = this.arrangeData.bind(this)
    this.confirmFilters = this.confirmFilters.bind(this)
  }

returnShiftTypeList(){
    if(this.state.shiftTypeList.length == 0){
      this.getShiftTypeList()
    }
    return(this.state.shiftTypeList)
}


  arrangeList(list){
    var i
    var returnText = list[0]
    for(i = 1; i < list.length; i++){
      returnText = returnText + ", " + list[i]
    }
    return(returnText)
  }


clearFields(){
  this.setState({
    filterStartDate:'',
    filterEndDate:'',
    filterCityHall:-1
  })
  this.setState({requestState:0})
}

updateFilters(e){
  switch(e.target.id){
    case "filter0":
      this.setState({"filterStartDate":e.target.value})
      break;
    case "filter1":
      this.setState({"filterEndDate":e.target.value})
      break;
    case "filter2":
        this.setState({"filterCityHall":e.target.value})
        break;
    default:
      break;
  }
}

confirmFilters(){
    var filters = ''
    if(this.state.filterStartDate != ''){
      filters = filters + `&start_time="${this.state.filterStartDate}"`
    }
    if(this.state.filterEndDate != ''){
      filters = filters + `&end_time="${this.state.filterEndDate}"`

    }
    if(this.props.user.roles[this.props.user.current_role_idx].role == 'adm_c3sl'){
      if(this.state.filterCityHall != -1){

        filters = filters + `&city_hall_id=${this.state.filterCityHall}`
      }
    }

    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `schedule_per_type_report`;
    const params = `permission=${this.props.user.current_role}${filters}`

    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get"
    }).then(parseResponse).then(resp => {
      this.setState({"serviceTypeList":resp}, () => this.arrangeData())
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
  for(i = 0; i< this.state.serviceTypeList.length; i++){
    current = this.state.serviceTypeList[i]
    var j
    for(j = 0; j < current.service_types.length; j++){
      var serviceType = current.service_types[j]
      var k
      for(k = 0; k < serviceType.schedules.length; k++ ){
        protoRows.push([current.service_place_name, serviceType.description, current.professionals[k].name, serviceType.schedules[k]])
      }
    }
  }
  this.setState({"cols":["Local", "Tipo de Serviço", "Profissional", "Quantidade de atendimentos"]})
  this.setState({"rows":protoRows})
}

  getCityHall(){
    if(this.props.user.roles[this.props.user.current_role_idx].role == 'adm_c3sl'){
      if(this.state.cityHalls == 0){
        const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
        const collection = `city_halls`;
        const params = `permission=${this.props.user.current_role}`
        fetch(`${apiUrl}/${collection}?${params}`, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json" },
            method: "get"
        }).then(parseResponse).then(resp => {
           this.setState({"cityHalls":resp.entries})
        }).catch(({errors}) => {
          if(errors) {
            let full_error_msg = "";
            errors.forEach(function(elem){ full_error_msg += elem + '\n' });
            Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
            throw errors;
            }
          }
        )
        return(this.state.cityHalls)
      }else{
        return(this.state.cityHalls)
      }
    }

  }

render() {
    return (
      <div className="contentWrapper">
        <Card>
        <h5>Filtros do relatório</h5>
          <div>
            <br/>
            <Row>
            <Input id="filter0" s={4} name='on' type='date' label="Data de Início" value={this.state.filterStartDate} onChange={this.updateFilters} />
            <Input id="filter1" s={4} name='on' type='date' label="Data de Fim" value={this.state.filterEndDate} onChange={this.updateFilters}/>
            {this.props.user.roles[this.props.user.current_role_idx].role == 'adm_c3sl'
               &&(<Input id="filter2" s={4} label="Cidade" type="select" default="-1" value={this.state.filterCityHall} onChange={this.updateFilters}>
                    <option value="-1">Sem filtro</option>
                    {this.getCityHall().map(function(element,i){
                      return(<option value={element.id} key={i}>{element.name}</option>)
                    })}
                  </Input>
             )
          }
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
const shiftTypeReport = connect(
  mapStateToProps
)(getshiftTypeReport)

export default shiftTypeReport
