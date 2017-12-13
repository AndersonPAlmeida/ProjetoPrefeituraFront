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
import styles from './styles/scalesReport.css'
var jsPDF


class getScalesReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scalesList: []
    }
    this.getScalesList = this.getScalesList.bind(this)
    this.returnScalesList = this.returnScalesList.bind(this)
  }

  componentDidMount(){
    jsPDF = require('jspdf')
    this.getScalesList()
  }

returnScalesList(){
    if(this.state.scalesList.length == 0){
      this.getScalesList()
    }
    console.log(this.state.scalesList)
    return(this.state.scalesList)
}

getScalesList(){
  const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `scales`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get"
    }).then(parseResponse).then(resp => {
      this.setState({"scalesList":resp}, () => console.log(this.state))
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

  arrangeList(list){
    var i
    console.log(list)
    var returnText = list[0]
    for(i = 1; i < list.length; i++){
      returnText = returnText + ", " + list[i]
    }
    return(returnText)
  }

render() {
    return (
      <div className="contentWrapper">
        <div id="divtoPDF">
          <Table className="bordered striped" style={{fontSize:"70%"}}>
            <thead>
              <tr>
                <th>Nome do profissional</th>
                <th>CPF</th>
                <th>Registro</th>
                <th>Papéis</th>
              </tr>
            </thead>
            <tbody>
              {this.returnScalesList().map(function(element,i){
                    return(
                      <tr key={i}>
                        <td>{element.name}</td>
                        <td>{element.cpf}</td>
                        <td>{element.registration}</td>
                        <td>{this.arrangeList(element.roles_names)}</td>
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
const scalesReport = connect(
  mapStateToProps
)(getScalesReport)

export default scalesReport
