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
import styles from './styles/citizenReport.css'
var jsPDF


class getCitizenReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      citizensList: []
    }
    this.getCitizensList = this.getCitizensList.bind(this)
    this.returnCitizenList = this.returnCitizenList.bind(this)
  }

  componentDidMount(){
    jsPDF = require('jspdf')
  }
returnCitizenList(){
  if(this.state.citizensList.length == 0){
    this.getCitizensList()
  }
  return(this.state.citizensList)
}

getCitizensList(){
  const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `citizens`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get"
    }).then(parseResponse).then(resp => {
      this.setState({"citizensList":resp}, () => console.log(this.state))
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
        var pdf = new jsPDF('p', 'pt', 'letter');
      var source = $('#divtoPDF')[0];
      var specialElementHandlers = {
        '#bypassme': function(element, renderer) {
          return true
        }
      };

      var margins = {
        top: 50,
        left: 60,
        width: 545
      };

      pdf.fromHTML (
        source // HTML string or DOM elem ref.
        , margins.left // x coord
        , margins.top // y coord
        , {
          'width': margins.width // max width of content on PDF
          , 'elementHandlers': specialElementHandlers
        },
        function (dispose) {
          // dispose: object with X, Y of the last line add to the PDF
          // this allow the insertion of new lines after html
          pdf.save('relatorio_cidadaos.pdf');
        }
      )
  }

render() {
    return (
      <div className="contentWrapper">
        <div id="divtoPDF">
          <Table className="bordered striped">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>RG</th>
                <th>Nascimento</th>
                <th>Telefone 1</th>
                <th>Telefone 2</th>
              </tr>
            </thead>
            <tbody>
              {this.returnCitizenList().map(function(element,i){
                    return(
                      <tr key={i}>
                        <td>{element.name}</td>
                        <td>{element.cpf}</td>
                        <td>{element.rg}</td>
                        <td>{this.formatDate(element.birth_date)}</td>
                        <td>{element.phone1}</td>
                        <td>{element.phone2}</td>
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
const citizenReport = connect(
  mapStateToProps
)(getCitizenReport)

export default citizenReport
