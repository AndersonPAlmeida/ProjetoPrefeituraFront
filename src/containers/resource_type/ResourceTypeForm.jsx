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

import React, {Component} from 'react';
import { Link } from 'react-router';
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize';
import styles from './styles/ResourceTypeForm.css';
import 'react-day-picker/lib/style.css';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { ResourceTypeImg } from '../images';
import MaskedInput from 'react-maskedinput';
import update from 'react-addons-update';

class getResourceTypeForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      resource_type: {
        situation: true,
        mobile: true,
        description: '',
        name: '',
        city_hall_id: 0
      },
      previous_data: undefined,
      city_halls: []
    };
  }

  componentWillMount() {
    var self = this;
    if (this.props.is_edit)
      var previous_data = {
        situation: Boolean(this.props.data.active),
        mobile: this.props.data.mobile === 'false' ? false : true,
        description: this.props.data.description,
        name: this.props.data.name,
        city_hall_id: this.props.data.city_hall_id
      };
    if(this.props.current_role.role != 'adm_c3sl') {

      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
      const collection = `/city_halls/${this.props.current_role.city_hall_id}`;
      const params = this.props.fetch_params;
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json' },
        method: 'get',
      }).then(parseResponse).then(resp => {
        self.setState({ city_halls: resp });
        if (this.props.is_edit)
          this.setState({ resource_type: previous_data });

      });

      this.setState({
        resource_type: update(this.state.resource_type,
          {['city_hall_id']: {$set: this.props.current_role.city_hall_id}})
      });
    }
    else {
      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
      const collection = 'forms/service_type_index';
      const params = this.props.fetch_params;
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json' },
        method: 'get',
      }).then(parseResponse).then(resp => {
        if (this.props.is_edit)
          this.setState({ resource_type: previous_data });
        self.setState({ city_halls: resp.city_halls });
      });
    }

  }

  handleInputResourceTypeChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;



    this.setState({
      resource_type: update(this.state.resource_type, { [name]: {$set: value} })
    });
  }

  handleSubmit() {
    let errors = [];
    let formData = {};
    formData = this.state.resource_type;

    if(!formData['name'])
      errors.push('Campo Nome é obrigatório.');
    if(errors.length > 0) {
      let full_error_msg = '';
      errors.forEach(function(elem){ full_error_msg += elem + '\n'; });
      Materialize.toast(full_error_msg, 10000, 'red',function(){$('#toast-container').remove();});
    } else {
      const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
      const collection = this.props.fetch_collection;
      const params = this.props.fetch_params;
      let fetch_body = {};
      if(this.props.is_edit) {
        fetch_body['resource_type'] = formData;
      }
      else {
        fetch_body = formData;
      }
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json' },
        method: this.props.fetch_method,
        body: JSON.stringify(fetch_body)
      }).then(parseResponse).then(resp => {
        if(this.props.is_edit)
          Materialize.toast('Tipo de recurso editado com sucesso.', 10000, 'green',function(){$('#toast-container').remove();});
        else
          Materialize.toast('Tipo de recurso criado com sucesso.', 10000, 'green',function(){$('#toast-container').remove();});
        browserHistory.push(this.props.submit_url);
      }).catch(({errors}) => {
        if(errors) {
          let full_error_msg = '';
          errors['full_messages'].forEach(function(elem){ full_error_msg += elem + '\n'; });
          Materialize.toast(full_error_msg, 10000, 'red',function(){$('#toast-container').remove();});
          throw errors;
        }
      });
    }
  }

  confirmButton() {
    return (
      <div className="card-action">
        <a className='back-bt waves-effect btn-flat' href='#' onClick={this.props.prev}> Voltar </a>
        <button className="waves-effect btn right button-color" onClick={this.handleSubmit.bind(this)} name="commit" type="submit">{this.props.is_edit ? 'Atualizar' : 'Criar'}</button>
      </div>
    );
  }

  pickCityHall() {

    if(this.props.current_role.role != 'adm_c3sl') {
      return (
        <input disabled
           name="selected_city_hall"
           type='text'
           className='input-field'
           value={this.props.current_role.city_hall_name}
        />
      )
    }

    const cityHallsList = (
      this.state.city_halls.map((city_hall) => {
        return (
          <option key={city_hall.id} value={city_hall.id}>{city_hall.name}</option>
        );
      })
    );
    return (
      <Input
        name="city_hall_id"
        type='select'
        value={this.state.resource_type.city_hall_id}
        onChange={
          (event) => {
            if(event.target.value != this.state.selected_city_hall) {
              this.handleInputResourceTypeChange(event);
            }
          }
        }
        >
        <option value='0' disabled>Escolha a prefeitura</option>
        {cityHallsList}
      </Input>
    );
  }

  render() {
    return (
      <main>
        <Row>
          <Col s={12}>
            <div className='card'>
              <div className='card-content'>
                {this.props.is_edit ?
                  <h2 className="card-title">Alterar tipo de recurso: {this.props.data.name}</h2>
                  :
                  <h2 className="card-title">Cadastrar tipo de recurso</h2>
                }

                <Row>
                  <Col s={12} l={6}>
                    <div id='resource-type-size'>
                      <h6 >Prefeitura:</h6>
                      <div>
                        {this.pickCityHall()}
                      </div>
                    </div>
                  </Col>

                  <Col s={12} l={6}>
                    <div id='resource-type-size'>
                      <h6>Recurso Móvel*:</h6>
                      <div>
                        <Input
                          type='select'
                          name='mobile'
                          value={this.state.resource_type.mobile}
                          onChange={this.handleInputResourceTypeChange.bind(this)}
                        >
                          <option key={0} value={true}>Sim</option>
                          <option key={1} value={false}>Não</option>
                        </Input>
                      </div>
                    </div>
                  </Col>
                </Row>


                <Row>
                  <Col s={12} l={6}>
                    <div id='resource-type-size'>
                      <h6>Situação:</h6>
                      <div>
                        <Input
                          type='select'
                          name='situation'
                          value={this.state.resource_type.situation}
                          onChange={this.handleInputResourceTypeChange.bind(this)}
                        >
                          <option key={0} value={true}>Ativo</option>
                          <option key={1} value={false}>Inativo</option>
                        </Input>
                      </div>
                    </div>
                  </Col>

                  <Col s={12} l={6}>
                    <div id='resource-type-size-text'>
                      <h6>Nome*:</h6>
                      <label>
                        <Input
                          type="text"
                          className='input-field'
                          name="name"
                          value={this.state.resource_type.name}
                          onChange={this.handleInputResourceTypeChange.bind(this)}
                        />
                      </label>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col s={12} l={6} offset={'l3'}>
                    <div>
                      <h6>Descrição*:</h6>
                      <label>
                        <textarea
                          className='input-field materialize-textarea black-text'
                          name="description"
                          placeholder="Adicione uma descrição"
                          value={this.state.resource_type.description}
                          onChange={this.handleInputResourceTypeChange.bind(this)}
                        />
                      </label>
                    </div>

                  </Col>
                </Row>
                <p><font color="red"> Campos com (*) são de preenchimento obrigatório.</font></p>

                {this.confirmButton()}
              </div>
            </div>
          </Col>
        </Row>
      </main>
    );
  }
}

const ResourceTypeForm = connect()(getResourceTypeForm );
export default ResourceTypeForm;
