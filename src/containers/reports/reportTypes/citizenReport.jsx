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
import styles from './styles/citizenReport.css'
import ReportPDF from '../reportPDF';


class getCitizenReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      citizensList: [],
      sortType:0,
      cols:[],
      rows:[]
    }
    this.getDatafromBackEnd = this.getDatafromBackEnd.bind(this)
    this.returnCitizenList = this.returnCitizenList.bind(this)
    this.handleDecisionChange = this.handleDecisionChange.bind(this)
    this.arrangeData = this.arrangeData.bind(this)
  }

returnCitizenList(){
  if(this.state.citizensList.length == 0){
    this.getCitizensList()
  }
  return(this.state.citizensList)
}

componentDidMount(){
  this.getDatafromBackEnd("0");
}

getDatafromBackEnd(sortType){
    var sortValue = "name"
    if(sortType == '0'){
      sortValue = "name"
    }else{
      sortValue = "birth_date"
    }
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `citizens`;
    const params = `permission=${this.props.user.current_role}&q[s]=${sortValue}+asc`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get"
    }).then(parseResponse).then(resp => {
      this.setState({"citizensList":resp}, () =>this.arrangeData())
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

  arrangeData(){
    console.log("arrange")
    var i
    this.setState({"cols":["Nome","CPF","Data de nascimento"]})
    var protoRows = []
    console.log(this.state)
    for(i = 0; i < this.state.citizensList.entries.length; i++){
      protoRows.push([ this.state.citizensList.entries[i].name, this.state.citizensList.entries[i].cpf, this.formatDate(this.state.citizensList.entries[i].birth_date)] )
      console.log(protoRows)
    }
    this.setState({"rows":protoRows})
  }


  formatDate(date){
    return(date[8] + date[9] + '/' + date[5] + date[6] + '/' + date[0] + date[1] + date[2] + date[3])
  }



handleDecisionChange(e){
  this.setState({"sortType":e.target.value})
}

render() {
    return (
      <div className="contentWrapper">
      <Card>
        <h5>Opções do relatório</h5>
        <Row>
          <Input s={6} type='select' defaultValue='0' onChange={this.handleDecisionChange}>
            <option value='0'>Ordenar por nome</option>
            <option value='1'>Ordenar por data de nascimento</option>
          </Input>
          <Button  style={{marginTop:"1em"}} onClick={()=>this.getDatafromBackEnd(this.state.sortType)} >Salvar opção</Button>

        </Row>
        <ReportPDF h1="Relatório de cidadãos" h2="" rows={this.state.rows} cols={this.state.cols} filename="relatorio_cidadaos.pdf"/>
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
const citizenReport = connect(
  mapStateToProps
)(getCitizenReport)

export default citizenReport
