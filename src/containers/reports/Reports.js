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


class getReports extends Component {
  constructor(props) {
    super(props)

  }
  componentDidMount(){
    console.log(this.props.user)
    jsPDF = require('jspdf')

  }



  render() {
    return (
      <div>Teste</div>
    )
  }
}


const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  return {
    user
  }
}
const Reports = connect(
  mapStateToProps
)(getReports)

export default Reports
