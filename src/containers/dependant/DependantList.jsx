import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/DependantList.css'
import DayPicker, { DateUtils } from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julia', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const WEEKDAYS_LONG = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const WEEKDAYS_SHORT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

function addZeroBefore(n) {
  return (n < 10 ? '0' : '') + n;
}

class getDependantList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          dependants: []
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `citizens/${this.props.user.citizen.id}/dependants`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ dependants: resp })
    });
  }

	showList() {
    const dependantList = (
      this.state.dependants.map((dependant) => {
        return (
          <div>
            {dependant.name} 
            <a className='back-bt waves-effect btn-flat' href='#' onClick={ () => browserHistory.push(`/dependants/${dependant.id}/edit`) }> Editar </a>
          </div>
        )
      })
    )
		return (
			<div className='select-field'>
				<b>Dependentes:</b>
				<div>
          {dependantList}
				</div>
      </div>
    )
	}

  prev() {
    browserHistory.push("citizens/schedules/agreement")
  }

	confirmButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' href='#' onClick={this.prev}> Voltar </a>
      </div>
		)
	}

  render() {
    return (
      <main>
      	<Row>
	        <Col s={12}>
		      	<div>
		      		{this.showList()}
		      	</div>
	      	</Col>
	    </Row>
	  </main>
    )
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  return {
    user
  }
}

const DependantList = connect(
  mapStateToProps
)(getDependantList)
export default DependantList
