import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env'
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response"
import {Row, Col, Table, Button} from 'react-materialize'
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import html2canvas from 'html2canvas';
import styles from './styles/MyReport.css';
import { LogoImage } from '../images'
var jspdf
var jspdfautotable


class getMyReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rows: [],
      columns: []
    }
    this.pdfToHTML=this.pdfToHTML.bind(this);
  }
  componentDidMount(){
    this.setState({"rows": [
      ["CPF",this.formatCpf(this.props.user.citizen.cpf)],
      ["RG",this.props.user.citizen.rg],
      ["Data de Nascimento",this.formatDate(this.props.user.citizen.birth_date)],
      ["Email",this.props.user.citizen.email],
      ["Cidade",this.props.user.citizen.city.name],
      ["Estado",this.props.user.citizen.state.name],
      ["Endereço",this.props.user.citizen.address.address +', '+this.props.user.citizen.address.neighborhood],
      ["CEP",this.props.user.citizen.address.zipcode],
      ["Telefone",this.props.user.citizen.phone1],
      ["Telefone 2",this.props.user.citizen.phone2]
      ]
    })
    this.setState({"columns":
      ["Dados Cadastrais"," "]
    })
    jspdf = require('jspdf')
    jspdfautotable = require('jspdf-autotable')
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

  pdfToHTML(){
    var doc = new jspdf('p', 'pt');
    var name = this.props.user.citizen.name
    var nowTime = new Date()
    var dateURL = "Criado em " + window.location.href + "  " + this.formatDateTime(nowTime)

    doc.autoTable(this.state.columns, this.state.rows, {
      columnStyles: {id: {fillColor: 255}},
        margin: {top: 60},
    addPageContent: function(data) {
      //header
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.setFontStyle('normal');
      doc.text("Relatório Cadastral", data.settings.margin.left + 15, 22);
      doc.text(name, data.settings.margin.left + 15, 50);

      //footer
      var str = "Página " + data.pageCount;
      doc.setFontSize(10);
      doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
      doc.text(dateURL, data.settings.margin.left + 100, doc.internal.pageSize.height - 10)
    }
});

    doc.save("relatorio_cadastral.pdf");

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
                <h5 ><b>Cadastro: </b>{this.props.user.citizen.name}</h5>

            <Table className="bordered striped" id="tabela">
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
          <Button onClick={this.pdfToHTML}>Baixar Relatório em PDF</Button>
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
