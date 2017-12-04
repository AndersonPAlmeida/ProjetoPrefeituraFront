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
import PdfConverter from 'jspdf';
import 'jspdf-autotable'

class getMyReport extends Component {
  constructor(props) {
      super(props)
      this.state = {
      };
  }
  componentDidMount(){
    console.log(this.props.user)
  }


  render() {
    return (
      <div>


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
