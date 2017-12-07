import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env'
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response"
import {Row, Col, Table} from 'react-materialize'
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import styles from './styles/MyReport.css';
import { LogoImage } from '../images'
var jsPDF


class getMyReport extends Component {
  constructor(props) {
    super(props)
    this.pdfToHTML=this.pdfToHTML.bind(this);

  }
  componentDidMount(){
    console.log(this.props.user)
    jsPDF = require('jspdf')

  }

  pdfToHTML(){
    var pdf = new jsPDF('p', 'pt', 'letter');
    var source = $('#HTMLtoPDF')[0];
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
        pdf.save('relatorio_cadastral.pdf');
      }
    )
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
      <div className="card dataContainer">
        <div className="card-content">
          <div id="HTMLtoPDF" className="mt4" >
            <div>
              <img alt="Logo agendador" src={LogoImage} width="64px"/>
            </div>
                <h5 ><b>Cadastro: </b>{this.props.user.citizen.name}</h5>

            <Table className="bordered striped">
              <thead>
                <tr>
                  <th>Dados cadastrais</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><p>CPF</p> </td>
                  <td> {this.formatCpf(this.props.user.citizen.cpf)}</td>
                </tr>
                <tr>
                  <td>RG</td>
                  <td>{this.props.user.citizen.rg}</td>
                </tr>

                <tr>
                  <td>Data de Nascimento</td>
                  <td>{this.formatDate(this.props.user.citizen.birth_date)}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{this.props.user.citizen.email}</td>
                </tr>
                <tr>
                  <td>Cidade</td>
                  <td>{this.props.user.citizen.city.name}</td>
                </tr>
                <tr>
                  <td>Estado</td>
                  <td>{this.props.user.citizen.state.name}</td>
                </tr>
                <tr>
                  <td>Endereço</td>
                  <td>{this.props.user.citizen.address.address +', '+this.props.user.citizen.address.neighborhood}</td>
                </tr>
                <tr>
                  <td>CEP</td>
                  <td>{this.props.user.citizen.address.zipcode }</td>
                </tr>
                <tr>
                  <td>Telefone</td>
                  <td>{this.props.user.citizen.phone1}</td>
                </tr>
                {this.props.user.citizen.phone2 &&
                  (<tr><td>Telefone 2</td><td>{this.props.user.citizen.phone2}</td></tr>)
                }
              </tbody>
            </Table>
          </div>
          <button onClick={this.pdfToHTML}>Baixar Relatório em PDF</button>
        </div>
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
const myReport = connect(
  mapStateToProps
)(getMyReport)

export default myReport
