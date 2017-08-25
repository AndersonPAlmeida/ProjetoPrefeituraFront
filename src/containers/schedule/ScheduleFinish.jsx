import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ScheduleFinish.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'

function addZeroBefore(n) {
  return (n < 10 ? '0' : '') + n;
}

class getScheduleCitizen extends Component {
  constructor(props) {
      super(props)
      this.state = {
        schedule: []
      }
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `schedules/${this.props.params.schedule_id}/confirmation`;
    const params = `permission=${this.props.user.current_role}&citizen_id=${this.props.params.citizen_id}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ schedule: resp })
      console.log(this.state.schedule)
    });
  }

  addZeroBefore(n) {
    return (n < 10 ? '0' : '') + n;
  }

  mainComponent() {
    var d = new Date(this.state.schedule.service_start_time)
    var date = d.getDate()  + "/" + (d.getMonth()+1) + "/" + d.getFullYear()
    var time = this.addZeroBefore(d.getHours()) + ":" + this.addZeroBefore(d.getMinutes())
    return (
      <div className='card'>
            <div className='card-content'>
              <h2 className='card-title h2-title-home'> Passo 3 de 3 - Confirmação do agendamento: </h2>
              <p> 
                <b>Setor: </b>
                {this.state.schedule.sector_name}
              </p>
              <p>
                <b>Tipo de Atendimento: </b>
                {this.state.schedule.service_type_name}
              </p>
              <p>
                <b>Local de Atendimento: </b>
                {this.state.schedule.service_place_name}
              </p>
              <p>
                <b>Endereço: </b>
                {this.state.schedule.service_place_address_street}, {this.state.schedule.service_place_address_number} 
              </p>
              <p>
                <b>Data do agendamento: </b>
                {date}
              </p>
              <p>
                <b>Horário do atendimento: </b>
                {time}
              </p>

            </div>
            {this.confirmButton()}
        </div>
    )
  }

  


	confirmButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' onClick={() => this.props.prev()} > Voltar </a>
				<button className="waves-effect btn right" name="commit" type="submit">Continuar</button>
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
const ScheduleCitizen = connect(
  mapStateToProps
)(getScheduleCitizen)
export default ScheduleCitizen 
