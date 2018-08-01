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
import styles from './styles/ProfessionalUserShow.css'
import { port, apiHost, apiPort, apiVer } from '../../../../config/env';
import {parseResponse} from "../../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import { UserImg } from '../../images';

class getProfessionalUserShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      citizen: {},
      dependants: [],
      photo: null
    }
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    var collection = `citizens/${this.props.params.citizen_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ citizen: resp }, () => {
          collection = `citizens/${this.state.citizen.id}/picture`
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

    collection = `citizens/${this.props.params.citizen_id}/dependants`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ dependants: resp })
    });
  }

  showDependants() {
    const dependantsList = (
      this.state.dependants.map((dependant) => {
        return (
          <p key={dependant.id}>
            <b>Dependentes: </b>
            <a className='back-bt waves-effect btn-flat btn-color'
              href='#'
              onClick={ () =>
                browserHistory.push(`/professionals/users/${this.props.params.citizen_id}/dependants/${dependant.id}`)
              }>
              {dependant.name}
            </a>
          </p>
        )
      })
    )
    return (
      <div>
        {dependantsList}
      </div>
    )
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Informações do Cidadão: </h2>
          <img
            id='user_photo'
            width='230'
            height='230'
            src={this.state.photo}
          />
          <p>
            <b>Nome: </b>
            {this.state.citizen.name}
          </p>
          <p>
            <b>CPF: </b>
            {this.state.citizen.cpf}
          </p>
          <p>
            <b>RG: </b>
            {this.state.citizen.rg}
          </p>
          <p>
            <b>Data de Nascimento: </b>
            {this.state.citizen.birth_date}
          </p>
          <p>
            <b>Telefone 1: </b>
            {this.state.citizen.phone1}
          </p>
          <p>
            <b>Telefone 2: </b>
            {this.state.citizen.phone2}
          </p>
          <p>
            <b>E-mail: </b>
            {this.state.citizen.email}
          </p>
          <p>
            <b>CEP: </b>
            {this.state.citizen.cep}
          </p>
          <p>
            <b>Bairro: </b>
            {this.state.citizen.neighborhood}
          </p>
          <p>
            <b>Endereço: </b>
            {this.state.citizen.address_street}
          </p>
          <p>
            <b>Complemento do endereço: </b>
            {this.state.citizen.address_complement}
          </p>
          {this.showDependants.bind(this)()}
          <p>
            <b>Observações: </b>
            {this.state.citizen.note}
          </p>
        </div>
        {this.editButton()}
      </div>
    )
  }

  editCitizen () {
    browserHistory.push(`professionals/users/${this.props.params.citizen_id}/edit`)
  }

  createDependant () {
    browserHistory.push(`professionals/users/${this.props.params.citizen_id}/dependants/new`)
  }

  prev() {
    browserHistory.push(`professionals/users`)
  }

	editButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
				<button className="waves-effect btn right" name="commit" onClick={this.createDependant.bind(this)} type="submit">Novo dependente</button>
				<button className="waves-effect btn right spacing" name="commit" onClick={this.editCitizen.bind(this)} type="submit">Editar</button>
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
const ProfessionalUserShow = connect(
  mapStateToProps
)(getProfessionalUserShow)
export default ProfessionalUserShow
