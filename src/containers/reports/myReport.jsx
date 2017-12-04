import React, {Component} from 'react'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env'
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response"
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';

var jsPDF


class getMyReport extends Component {
  constructor(props) {
      super(props)
      this.state = {
      };
      this.pdfToHTML=this.pdfToHTML.bind(this);
      this.getCitizenData=this.getCitizenData.bind(this);
      this.getCitizenAddress=this.getCitizenAddress.bind(this);

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
        pdf.save('relatorio_de_cadastro.pdf');
      }
    )
  }

getCitizenData(){
  return(<div>
    <p>Nome: {this.props.user.citizen.name}</p>
    <p>Data de nascimento: {this.props.user.citizen.birth_date}</p>
    </div>)
}

getCitizenAddress(){

}

    render() {
      return (
        <div>
         <div id="HTMLtoPDF">
           <center>
              <h3>Cadastro Agendador</h3>
              {this.getCitizenData()}
              {this.getCitizenAddress()}
              </center>
         </div>

         <button onClick={this.pdfToHTML}>Download PDF</button>
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
