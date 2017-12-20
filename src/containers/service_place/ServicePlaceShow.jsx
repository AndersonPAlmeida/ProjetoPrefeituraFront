import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ServicePlaceShow.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import strftime from 'strftime';

class getServicePlaceShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      service_place: {
        id: 0,
        name: '',
        cep: '',
        address_number: '',
        phone1: '',
        phone2: '',
        email: '',
        url: '',
        active: '',
        created_at: '',
        updated_at: '',
        city_hall_name: '',
        service_types: [],
        professionals: [],
        city: {},
        state: {},
        address: {}
      }
    }
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `service_places/${this.props.params.service_place_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ service_place: resp })
    });
  }

  showProfessionals() {
    const professionalsList = (
      this.state.service_place.professionals.map((professional) => {
        return (
          <div>{professional.name}</div>
        )
      })
    )
    return (
      <div>
        {professionalsList}
      </div>
    )
  }

  showServiceTypes() {
    const serviceTypesList = (
      this.state.service_place.service_types.map((service_type) => {
        return (
          <div>{service_type.description}</div>
        )
      })
    )
    return (
      <div>
        {serviceTypesList}
      </div>
    )
  }

  addZeroBefore(n) {
    return (n < 10 ? '0' : '') + n;
  }

  mainComponent() {
    var created_date = strftime.timezone('+0000')('%d/%m/%Y', new Date(this.state.service_place.created_at))
    var d = new Date(this.state.service_place.created_at)
    var created_time = this.addZeroBefore(d.getHours()) + ":" + this.addZeroBefore(d.getMinutes())
    var updated_date = strftime.timezone('+0000')('%d/%m/%Y', new Date(this.state.service_place.updated_at))
    d = new Date(this.state.service_place.updated_at)
    var updated_time = this.addZeroBefore(d.getHours()) + ":" + this.addZeroBefore(d.getMinutes())
    return (
    <div className='card'>
          <div className='card-content'>
            <h2 className='card-title h2-title-home'> Informações do Local de Atendimento: </h2>
            <p> 
              <b>Situação: </b>
              {this.state.service_place.active ? 'Ativo' : 'Inativo'}
            </p>
            <p> 
              <b>Nome: </b>
              {this.state.service_place.name}
            </p>
            <p>
              <b>Prefeitura: </b>
              {this.state.service_place.city_hall_name}
            </p>
            <p>
              <b>CEP: </b>
              {this.state.service_place.cep}
            </p>
            <p>
              <b>Bairro: </b>
              {this.state.service_place.address.neighborhood}
            </p>
            <p>
              <b>Endereço: </b>
              {this.state.service_place.address.address}
            </p>
            <p>
              <b>Número: </b>
              {this.state.service_place.address_number}
            </p>
            <p>
              <b>Complemento: </b>
              {this.state.service_place.address_complement}
            </p>
            <p>
              <b>Telefone 1: </b>
              {this.state.service_place.phone1}
            </p>
            <p>
              <b>Telefone 2: </b>
              {this.state.service_place.phone2}
            </p>
            <p>
              <b>E-mail: </b>
              {this.state.service_place.email}
            </p>
            <p>
              <b>Site: </b>
              {this.state.service_place.url}
            </p>
            <p>
              <b>Estado: </b>
              {this.state.service_place.state.name}
            </p>
            <p>
              <b>Munícipio: </b>
              {this.state.service_place.city.name}
            </p>
            <p>
              <b>Serviços: </b>
              {this.showServiceTypes()}
            </p>
            <p>
              <b>Profissionais: </b>
              {this.showProfessionals()}
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

  editServicePlace () {
    browserHistory.push(`service_places/${this.props.params.service_place_id}/edit`)
  }

  prev() {
    browserHistory.push(`service_places`)
  }  

	editButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
				<button className="waves-effect btn right" name="commit" onClick={this.editServicePlace.bind(this)} type="submit">Editar</button>
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
const ServicePlaceShow = connect(
  mapStateToProps
)(getServicePlaceShow)
export default ServicePlaceShow
