import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ShiftShow.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import strftime from 'strftime';

class getShiftShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shift: {
        id: 0,
        execution_start_time: '',
        execution_end_time: '',
        service_amount: '',
        notes: '',
        service_place_name: '',
        service_type_description: '',
        professional_responsible_name: '',
        professional_performer_name: '',
        schedules: []
      }
    }
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `shifts/${this.props.params.shift_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ shift: resp })
    });
  }

  showSchedules() {
    var start_date
    var start_time
    var end_date
    var end_time
    var d
    const schedulesList = (
      this.state.shift.schedules.map((schedule) => {
        var start_date = strftime.timezone('+0000')('%d/%m/%Y', new Date(schedule.service_start_time))
        var d = new Date(schedule.service_start_time)
        var start_time = this.addZeroBefore(d.getHours()) + ":" + this.addZeroBefore(d.getMinutes())
        var end_date = strftime.timezone('+0000')('%d/%m/%Y', new Date(schedule.service_end_time))
        d = new Date(schedule.service_end_time)
        var end_time = this.addZeroBefore(d.getHours()) + ":" + this.addZeroBefore(d.getMinutes())
        return (
          <div>
            <p> 
              <b>Horário de início: </b>
              {`${start_date} - ${start_time}`}
            </p>
            <p> 
              <b>Horario de termino: </b>
              {`${end_date} - ${end_time}`}
            </p>
            <p> 
              <b>Situação: </b>
              {schedule.situation_description}
            </p>
            <p> 
              <b>Cidadão: </b>
              {schedule.citizen_name}
            </p>
            <p> 
              <b>Local de atendimento: </b>
              {schedule.service_place_name}
            </p>
            <p> 
              <b>Observações: </b>
              {schedule.note}
            </p>
            <br />
          </div>
        )
      })
    )
    return (
      <div>
        <b>Agendamentos: </b>
        <div className='schedules-list'>
          {schedulesList}
        </div>
      </div>
    )
  }

  addZeroBefore(n) {
    return (n < 10 ? '0' : '') + n;
  }

  mainComponent() {
    var start_date = strftime.timezone('+0000')('%d/%m/%Y', new Date(this.state.shift.execution_start_time))
    var d = new Date(this.state.shift.execution_start_time)
    var start_time = this.addZeroBefore(d.getHours()) + ":" + this.addZeroBefore(d.getMinutes())
    var end_date = strftime.timezone('+0000')('%d/%m/%Y', new Date(this.state.shift.execution_end_time))
    d = new Date(this.state.shift.execution_end_time)
    var end_time = this.addZeroBefore(d.getHours()) + ":" + this.addZeroBefore(d.getMinutes())
    return (
    <div className='card'>
          <div className='card-content'>
            <h2 className='card-title h2-title-home'> Informações da Escala: </h2>
            <p> 
              <b>Horário de início: </b>
              {`${start_date} - ${start_time}`}
            </p>
            <p> 
              <b>Horario de termino: </b>
              {`${end_date} - ${end_time}`}
            </p>
            <p>
              <b>Profissional: </b>
              {this.state.shift.professional_performer_name}
            </p>
            <p>
              <b>Profissional Responsável: </b>
              {this.state.shift.professional_responsible_name}
            </p>
            <p>
              <b>Local de atendimento:: </b>
              {this.state.shift.service_place_name}
            </p>
            <p>
              <b>Profissional: </b>
              {this.state.shift.service_type_description}
            </p>
            <p>
              <b>Quantidade de serviço: </b>
              {this.state.shift.service_amount}
            </p>
            <p>
              <b>Observações: </b>
              {this.state.shift.notes}
            </p>
            {this.showSchedules()}
          </div>
          {this.editButton()}
      </div>
    )
  }

  editShift () {
    browserHistory.push(`shifts/${this.props.params.shift_id}/edit`)
  }

  prev() {
    browserHistory.push(`shifts`)
  }  

	editButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
				<button className="waves-effect btn right" name="commit" onClick={this.editShift.bind(this)} type="submit">Editar</button>
      </div>
		)
	}

  render() {
    return (
      <main>
      	<Row>
	        <Col s={12}>
		      	<div>
              {this.mainComponent()}
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
const ShiftShow = connect(
  mapStateToProps
)(getShiftShow)
export default ShiftShow
