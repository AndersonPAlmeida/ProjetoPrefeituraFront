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
import styles from './styles/ResourceTypeShow.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';

class getResourceTypeShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      resource_type: {
        active: '',
        mobile: '',
        description: '',
        name: '',
        
      },
      city_hall:{}
    }
    this.getCityHallName = this.getCityHallName.bind(this);
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_types/${this.props.params.resource_type_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ resource_type: resp })
      this.getCityHallName(resp)
    });
  }


  getCityHallName(info) {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `city_halls/${info.city_hall_id}`;
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

  mainComponent() {
    return (
      <div className='card'>
            <div className='card-content'>
              <h2 className='card-title h2-title-home'> Informações do Tipo de Recurso: </h2>
              <p> 
                <b>Situação: </b>
                {this.state.resource_type.active ? 'Ativo' : 'Inativo'}
              </p>
              <p> 
                <b>Nome: </b>
                {this.state.resource_type.name}
              </p>
              <p> 
                <b>Descrição: </b>
                {this.state.resource_type.description}
              </p>
              <p> 
                <b>Recurso móvel: </b>
                {this.state.resource_type.mobile != "false" ? 'Sim' : 'Não'}
              </p>
              <p> 
                <b>Prefeitura: </b>
                {this.state.city_hall.name}
              </p>
            </div>
            {this.editButton()}
        </div>
    )
  }

  editResourceType () {
    browserHistory.push(`resource_types/${this.props.params.resource_type_id}/edit`)
  }

  prev() {
    browserHistory.push(`resource_types`)
  }  

	editButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
				<button className="waves-effect btn right" name="commit" onClick={this.editResourceType.bind(this)} type="submit">Editar</button>
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
const ResourceTypeShow = connect(
  mapStateToProps
)(getResourceTypeShow)
export default ResourceTypeShow
