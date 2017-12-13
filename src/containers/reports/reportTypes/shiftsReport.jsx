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
import styles from './styles/shiftsReport.css'
var jsPDF


class getShiftsReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shiftsList: []
    }
    this.getShiftsList = this.getShiftsList.bind(this)
    this.returnShiftsList = this.returnShiftsList.bind(this)
    this.formatDateTime = this.formatDateTime.bind(this)
  }

  componentDidMount(){
    jsPDF = require('jspdf')
    this.getShiftsList()
  }

returnShiftsList(){
    if(this.state.shiftsList.length == 0){
      this.getShiftsList()
    }
    console.log(this.state.shiftsList)
    return(this.state.shiftsList)
}

getShiftsList(){
  const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `shifts`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get"
    }).then(parseResponse).then(resp => {
      this.setState({"shiftsList":resp}, () => console.log(this.state))
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

  printPDF(){
        var pdf = new jsPDF('p', 'pt', "a4");
        pdf.setFont("helvetica");
        pdf.setFontSize(1);
      var source = $('#divtoPDF')[0];
      var specialElementHandlers = {
        '#bypassme': function(element, renderer) {
          return true
        }
      };

      var margins = { top: 50,left: 10,right:10, width: 650};

      pdf.fromHTML (
        source, margins.left, margins.top,  {'width': margins.width, 'elementHandlers': specialElementHandlers},
        function (dispose) {
          pdf.save('relatorio_cidadaos.pdf');
        }
      )
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

render() {
    return (
      <div className="contentWrapper">
        <div id="divtoPDF">
          <Table className="bordered striped" style={{fontSize:"70%"}}>
            <thead>
              <tr>
                <th>Número do Atendimento</th>
                <th>Profissional 1</th>
                <th>Profissional 2</th>
                <th>Local do Atendimento</th>
                <th>Tipo do Atendimento</th>
                <th>Inicio</th>
                <th>Fim</th>
              </tr>
            </thead>
            <tbody>
              {this.returnShiftsList().map(function(element,i){
                    return(
                      <tr key={i}>
                        <td>{element.id}</td>
                        <td>{element.professional.registration}</td>
                        <td>{element.professional_2.registration}</td>
                        <td>{element.service_place.name}</td>
                        <td>{element.service_type.description}</td>
                        <td>{this.formatDateTime(element.execution_start_time)}</td>
                        <td>{this.formatDateTime(element.execution_end_time)}</td>
                      </tr>
                  );
                },this)}
            </tbody>
          </Table>
          <Button onClick={this.printPDF}>Relatório em PDF</Button>
        </div>

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
