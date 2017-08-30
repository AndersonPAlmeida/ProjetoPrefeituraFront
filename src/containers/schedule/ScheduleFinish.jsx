import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ScheduleFinish.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';

function addZeroBefore(n) {
  return (n < 10 ? '0' : '') + n;
}

class getScheduleFinish extends Component {
  constructor(props) {
      super(props)
      this.state = {
        schedule: [],
        confirm: 0
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
    }).catch(({errors}) => {
      if(errors) {
        console.log(errors)
        let full_error_msg = "";
        errors.forEach(function(elem){ full_error_msg += elem + '\n' });
        browserHistory.push(`citizens/${this.props.params.citizen_id}/schedules/schedule`)
        Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
        throw errors;
      }
    })
  }

  componentDidUpdate() {
    if(this.state.confirm != 0) {
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = `schedules/${this.props.params.schedule_id}/confirm`;
      const params = `permission=${this.props.user.current_role}&citizen_id=${this.props.params.citizen_id}`
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "put",
      }).then(parseResponse).then(resp => {
        browserHistory.push(`citizens/schedules`)
        Materialize.toast("Agendamento criado com sucesso", 10000, "green",function(){$("#toast-container").remove()});
      }).catch(({errors}) => {
        if(errors) {
          let full_error_msg = "";
          errors.forEach(function(elem){ full_error_msg += elem + '\n' });
          Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
          throw errors;
        }
      })
      this.setState({ confirm: 0 })
    }
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

              <p>
                <b> Observações*: </b>
              </p>
              <textarea id='obs_agendamento' className='materialize-textarea' maxlength='140'></textarea>
              
            </div>
            {this.confirmButton()}
        </div>
    )
  }

  handleSubmit() {
    this.setState({ confirm: 1 })
  }

  prev() {
    browserHistory.push(`citizens/${this.props.params.citizen_id}/schedules/schedule`)
  }  

	confirmButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
				<button className="waves-effect btn right" name="commit" onClick={this.handleSubmit.bind(this)} type="submit">Continuar</button>
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
const ScheduleFinish = connect(
  mapStateToProps
)(getScheduleFinish)
export default ScheduleFinish
