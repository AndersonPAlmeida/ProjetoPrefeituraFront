import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/CityHallShow.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import strftime from 'strftime';

class getCityHallShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      city_hall: {
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
        city: {},
        state: {},
        address: {}
      }
    }
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `city_halls/${this.props.params.city_hall_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ city_hall: resp })
    });
  }

  showProfessionals() {
    const professionalsList = (
      this.state.city_hall.professionals.map((professional) => {
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
      this.state.city_hall.service_types.map((service_type) => {
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
    var created_date = strftime.timezone('+0000')('%d/%m/%Y', new Date(this.state.city_hall.created_at))
    var d = new Date(this.state.city_hall.created_at)
    var created_time = this.addZeroBefore(d.getHours()) + ":" + this.addZeroBefore(d.getMinutes())
    var updated_date = strftime.timezone('+0000')('%d/%m/%Y', new Date(this.state.city_hall.updated_at))
    d = new Date(this.state.city_hall.updated_at)
    var updated_time = this.addZeroBefore(d.getHours()) + ":" + this.addZeroBefore(d.getMinutes())
    return (
    <div className='card'>
          <div className='card-content'>
            <h2 className='card-title h2-title-home'> Informações da Prefeitura: </h2>
            <p>
              <b>Situação: </b>
              {this.state.city_hall.active ? 'Ativo' : 'Inativo'}
            </p>
            <p>
              <b>Nome: </b>
              {this.state.city_hall.name}
            </p>
            <p>
              <b>CEP: </b>
              {this.state.city_hall.cep}
            </p>
            <p>
              <b>Bairro: </b>
              {this.state.city_hall.address.neighborhood}
            </p>
            <p>
              <b>Endereço: </b>
              {this.state.city_hall.address.address}
            </p>
            <p>
              <b>Número: </b>
              {this.state.city_hall.address_number}
            </p>
            <p>
              <b>Complemento: </b>
              {this.state.city_hall.address_complement}
            </p>
            <p>
              <b>Telefone 1: </b>
              {this.state.city_hall.phone1}
            </p>
            <p>
              <b>Telefone 2: </b>
              {this.state.city_hall.phone2}
            </p>
            <p>
              <b>E-mail: </b>
              {this.state.city_hall.email}
            </p>
            <p>
              <b>Site: </b>
              {this.state.city_hall.url}
            </p>
            <p>
              <b>Estado: </b>
              {this.state.city_hall.state.name}
            </p>
            <p>
              <b>Munícipio: </b>
              {this.state.city_hall.city.name}
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

  editCityHall () {
    //browserHistory.push(`city_halls/${this.props.params.city_hall_id}/edit`)
  }

  prev() {
    //browserHistory.push(`city_halls`)
  }

	editButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
				<button className="waves-effect btn right" name="commit" onClick={this.editCityHall} type="submit">Editar</button>
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
const CityHallShow = connect(
  mapStateToProps
)(getCityHallShow)
export default CityHallShow
