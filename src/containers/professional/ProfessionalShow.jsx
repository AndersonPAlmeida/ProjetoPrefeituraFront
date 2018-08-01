{/*
  * This file is part of Agendador.
  *
  * Agendador is free software: you can redistribute it and/or modify
  * it under the terms of the GNU General Public License as published by
  * the Free Software Foundation, either version 3 of the License, or
  * (at your option) any later version.
  *
  * Agendador is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  * GNU General Public License for more details.
  *
  * You should have received a copy of the GNU General Public License
  * along with Agendador.  If not, see <https://www.gnu.org/licenses/>.
  */}

import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ProfessionalShow.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import { UserImg } from '../images';

class getProfessionalShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      professional: { citizen: { city: {}, state: {} }, service_places: [] },
      photo: null
    }
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    var collection = `professionals/${this.props.params.professional_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ professional: resp }, () => {
          collection = `citizens/${this.state.professional.citizen.id}/picture`
          fetch(`${apiUrl}/${collection}?${params}`, {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            method: "get"
          })
            .then(resp => {
              var contentType = resp.headers.get("content-type");
              if(resp.status == 200 && contentType && contentType.indexOf("image") !== -1) {
                resp.blob().then(photo => {
                  self.setState({ photo: URL.createObjectURL(photo)});
                })
              } else {
                self.setState({ photo: UserImg });
              }
          }).catch(e => {})
        }
      )
    });
  }

  showServicePlaces() {
    const servicePlacesList = (
      this.state.professional.service_places.map((service_place) => {
        return (
          <div>{service_place.name}</div>
        )
      })
    )
    return (
      <div>
        {servicePlacesList}
      </div>
    )
  }

  mainComponent() {
    return (
      <div className='card'>
            <div className='card-content'>
              <h2 className='card-title h2-title-home'> Informações do Profissional: </h2>
              <img
                id='user_photo'
                width='230'
                height='230'
                src={this.state.photo}
              />
              <p> 
                <b>Nome: </b>
                {this.state.professional.citizen.name}
              </p>
              <p> 
                <b>CPF: </b>
                {this.state.professional.citizen.cpf}
              </p>
              <p> 
                <b>RG: </b>
                {this.state.professional.citizen.rg}
              </p>
              <p> 
                <b>Data de Nascimento: </b>
                {this.state.professional.citizen.birth_date}
              </p>
              <p> 
                <b>Telefone 1: </b>
                {this.state.professional.citizen.phone1}
              </p>
              <p> 
                <b>Telefone 2: </b>
                {this.state.professional.citizen.phone2}
              </p>
              <p> 
                <b>E-mail: </b>
                {this.state.professional.citizen.email}
              </p>
              <p> 
                <b>CEP: </b>
                {this.state.professional.citizen.cep}
              </p>
              <p> 
                <b>Estado: </b>
                {this.state.professional.citizen.state.name}
              </p>
              <p> 
                <b>Município: </b>
                {this.state.professional.citizen.city.name}
              </p>
              <p> 
                <b>Bairro: </b>
                {this.state.professional.citizen.neighborhood}
              </p>
              <p> 
                <b>Endereço: </b>
                {this.state.professional.citizen.address_street}
              </p>
              <p> 
                <b>Complemento do endereço: </b>
                {this.state.professional.citizen.address_complement}
              </p>
              <p> 
                <b>Matrícula: </b>
                {this.state.professional.registration}
              </p>
              <p> 
                <b>Cargo: </b>
                {this.state.professional.occupation_name}
              </p>
              <p> 
                <b>Locais de atendimento: </b>
                {this.showServicePlaces()}
              </p>
              <p> 
                <b>Observações: </b>
                {this.state.professional.citizen.note}
              </p>
            </div>
            {this.editButton()}
        </div>
    )
  }

  editProfessional () {
    browserHistory.push(`professionals/${this.props.params.professional_id}/edit`)
  }

  prev() {
    browserHistory.push(`professionals`)
  }  

	editButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
				<button className="waves-effect btn right" name="commit" onClick={this.editProfessional.bind(this)} type="submit">Editar</button>
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
const ProfessionalShow = connect(
  mapStateToProps
)(getProfessionalShow)
export default ProfessionalShow
