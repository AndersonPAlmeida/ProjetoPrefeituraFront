import React, {Component} from 'react'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env'
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response"
import {Row, Col} from 'react-materialize'
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import styles from './styles/MyReport.css';
var jsPDF


class getMyReport extends Component {
  constructor(props) {
      super(props)
      this.state = {
      };

  }
  componentDidMount(){
    console.log(this.props.user)
    jsPDF = require('jspdf')
  }

  printDocument() {
    const input = document.getElementById('divToPrint');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save("download.pdf");
      })
    ;
  }

  formatCpf(cpf){
  return(cpf[0] + cpf[1] + cpf[2] + '.' + cpf[3] + cpf[4] + cpf[5] + '.' + cpf[6] + cpf[7] + cpf[8] + '-' + cpf[9] + cpf[10])
  }
  formatDate(date){
    return(date[8] + date[9] + '/' + date[5] + date[6] + '/' + date[0] + date[1] + date[2] + date[3])
  }

    render() {
      return (
        <div>
          <div id="divToPrint" className="mt4">
          <Row>
          <Col l={6}>
             <ul className="collection with-header">
                  <li className="collection-header"><h4>{this.props.user.citizen.name}</h4></li>
                   <li className="collection-item"><b>CPF</b>: {this.formatCpf(this.props.user.citizen.cpf)}</li>
                   <li className="collection-item"><b>RG</b>: {this.props.user.citizen.rg}</li>
                   <li className="collection-item"><b>Data de nascimento</b>: {this.formatDate(this.props.user.citizen.birth_date)}</li>
                   <li className="collection-item"><b>Email</b>: {this.props.user.citizen.email}</li>
                </ul>
          </Col>
          <Col l={6}>
            <ul className="collection with-header">
                 <li className="collection-header"><h4>Dados cadastrais</h4></li>
                  <li className="collection-item"><b>Estado</b>: {this.props.user.citizen.state.name}</li>
                  <li className="collection-item"><b>Cidade</b>: {this.props.user.citizen.city.name}</li>
                  <li className="collection-item"><b>Endereço</b>: {this.props.user.citizen.address.address}</li>
                  <li className="collection-item"><b>CEP</b>: {this.props.user.citizen.address.zipcode}</li>
             </ul>
          </Col>
          </Row>
          </div>

         <button onClick={this.printDocument}>Download PDF</button>
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
const myReport = connect(
  mapStateToProps
)(getMyReport)

export default myReport
