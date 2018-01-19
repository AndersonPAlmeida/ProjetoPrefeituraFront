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
import styles from './styles/servicesReport.css'
import ReportPDF from '../reportPDF'


class getservicesReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      servicesList: [],
      servicesIndex:[],
      requestState:0
    }
    this.getservicesList = this.getservicesList.bind(this)
    this.returnservicesList = this.returnservicesList.bind(this)
    this.getServiceIndex = this.getServiceIndex.bind(this)
  }

  componentDidMount(){
    this.getservicesList()
  }

  getServiceIndex(){
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = `forms/schedule_index`;
      const params = `permission=${this.props.user.current_role}`
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get"
      }).then(parseResponse).then(resp => {

        this.setState({"servicesIndex":resp})
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

returnservicesList(){
    if(this.state.servicesList.length == 0){
      this.getservicesList()
    }
    console.log(this.state.servicesList)
    return(this.state.servicesList)
}

getservicesList(){
  const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `services`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get"
    }).then(parseResponse).then(resp => {
      this.setState({"servicesList":resp}, () => console.log(this.state))
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
        <h5>Filtros do relatório</h5>
          <div>
            <br/>
            <Row>
            <Input id="filter0" s={4} label="Local do Atendimento" type="select" default="-1" value={this.state.filterServicePlace} onChange={this.updateFilters}>
              <option value="-1">Nenhum</option>

            </Input>
            <Input id="filter1" s={4} name='on' type='date' label="Data de Início" value={this.state.filterStartDate} onChange={this.updateFilters} />
            <Input id="filter2" s={4} name='on' type='date' label="Data de Fim" value={this.state.filterEndDate} onChange={this.updateFilters}/>
          </Row>
          <Row>

            <Input id="filter3" s={4} label="Profissional" type="select" default="-1" value={this.state.filterProfessional} onChange={this.updateFilters}>
              <option value="-1">Nenhum</option>

              </Input>

            <Input id="filter4" s={4} label="Tipo de atendimento" type="select" default="-1" value={this.state.filterServiceType} onChange={this.updateFilters}>
              <option value="-1" >Nenhum</option>

            </Input>

            <Input id="filter5" s={4} label="Situação" type="select" default="-1" value={this.state.filterSituation} onChange={this.updateFilters}>
              <option value="-1">Nenhum</option>

            </Input>
          </Row>

          <Row>
            <Input id="filter6" s={4} label="Ordernar por" type="select" default="-1" value={this.state.filterSort} onChange={this.updateFilters}>
                <option value="-1">Nenhum</option>

            </Input>
            <Input id="filter7" s={4} name='on' label="CPF" value={this.state.filterCPF} onChange={this.updateFilters} />
            <Input id="filter8" s={4} name='on' label="Nome do Cidadão" value={this.state.filterName} onChange={this.updateFilters} />
          </Row>
          </div>
          <Button style={{marginRight:"1rem"}} onClick={this.clearFields}>Limpar Campos</Button>
          {this.state.requestState == "0"
            ?(<Button onClick={this.confirmFilters}>Confirmar filtros</Button>)
            :(<ReportPDF h1="Relatório de Agendamentos" h2="" cols={this.state.cols} rows={this.state.rows} filename="relatorio_agendamentoss.pdf" o='l'/>)
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
const servicesReport = connect(
  mapStateToProps
)(getservicesReport)

export default servicesReport
