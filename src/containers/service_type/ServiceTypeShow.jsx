import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ServiceTypeShow.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import strftime from 'strftime';

class getServiceTypeShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      service_type: {
        active: '',
        description: '',
        city_hall_name: '',
        updated_at: '',
        created_at: ''
      },
    }
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `service_types/${this.props.params.service_type_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ service_type: resp })
    });
  }

  addZeroBefore(n) {
    return (n < 10 ? '0' : '') + n;
  }

  mainComponent() {
    var created_date = strftime.timezone('+0000')('%d/%m/%Y', new Date(this.state.service_type.created_at))
    var d = new Date(this.state.service_type.created_at)
    var created_time = this.addZeroBefore(d.getHours()) + ":" + this.addZeroBefore(d.getMinutes())
    var updated_date = strftime.timezone('+0000')('%d/%m/%Y', new Date(this.state.service_type.updated_at))
    d = new Date(this.state.service_type.updated_at)
    var updated_time = this.addZeroBefore(d.getHours()) + ":" + this.addZeroBefore(d.getMinutes())
    return (
      <div className='card'>
            <div className='card-content'>
              <h2 className='card-title h2-title-home'> Informações do Tipo de Atendimento: </h2>
              <p> 
                <b>Situação: </b>
                {this.state.service_type.active ? 'Ativo' : 'Inativo'}
              </p>
              <p> 
                <b>Descrição: </b>
                {this.state.service_type.description}
              </p>
              <p> 
                <b>Prefeitura: </b>
                {this.state.service_type.city_hall_name}
              </p>
              <p> 
                <b>Atualizado em: </b>
                {`${updated_date}, ${updated_time}`}
              </p>
              <p> 
                <b>Criado em: </b>
                {`${created_date}, ${created_time}`}
              </p>
            </div>
            {this.editButton()}
        </div>
    )
  }

  editServiceType () {
    browserHistory.push(`service_types/${this.props.params.service_type_id}/edit`)
  }

  prev() {
    browserHistory.push(`service_types`)
  }  

	editButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
				<button className="waves-effect btn right" name="commit" onClick={this.editServiceType.bind(this)} type="submit">Editar</button>
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
const ServiceTypeShow = connect(
  mapStateToProps
)(getServiceTypeShow)
export default ServiceTypeShow
