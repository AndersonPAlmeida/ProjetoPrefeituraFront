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
import { Button, Input, Row, Col } from 'react-materialize'
import {fetch} from "../../redux-auth";
import { browserHistory } from 'react-router';
import update from 'react-addons-update';
import styles from './styles/UserForm.css'

function handleInputProfessionalChange(event) {
  const target = event.target;
  const value = target.value;
  const name = target.name;

  if(target.validity.valid) {
    this.setState({
      professional: update(this.state.professional, { [name]: {$set: value} })
    })
  }
}

function pickOccupation() {
  const occupationsList = (
    this.state.aux.occupations.map((occupation) => {
      return (
        <option value={occupation.id}>{occupation.name}</option>
      )
    })
  )
  return (
    <div>
      <h6>Cargo*:</h6>
      <div>
        <Input name="occupation_id" type='select' value={this.state.professional.occupation_id}
          onChange={handleInputProfessionalChange.bind(this)}
        >
          <option value='0' disabled>Escolha o cargo</option>
          {occupationsList}
        </Input>
      </div>
    </div>
  )
}

function pickPermission() {
  const permissionsList = (
    this.state.aux.permissions.map((permission) => {
      return (
        <option value={permission.role}>{permission.name}</option>
      )
    })
  )
  return (
    <div>
      <h6>Permissão:</h6>
      <div>
        <Input name="permission_id" type='select' 
          value={this.state.aux.permission_id}
          onChange={this.handleChange.bind(this)}
        >
          <option value={0} disabled>Escolha a permissão</option>
          {permissionsList}
        </Input>
      </div>
    </div>
  )
}

function pickServicePlace() {
  const servicePlacesList = (
    this.state.aux.service_places.map((service_place) => {
      return (
        <option value={service_place.id}>{service_place.name}</option>
      )
    })
  )
  return (
    <div>
      <h6>Local de Atendimento:</h6>
      <div>
        <Input name="service_place_id" type='select' value={this.state.aux.service_place_id}
          onChange={this.handleChange.bind(this)}
        >
          <option value={0} disabled>Escolha o local</option>
          {servicePlacesList}
        </Input>
      </div>
    </div>
  )
}

const role_name = {
  'citizen': "Cidadão",
  'responsavel_atendimento': "Responsável Atendimento",
  'atendente_local': "Atendente Local",
  'adm_local': "Administrador Local",
  'adm_prefeitura': "Administrador Prefeitura",
  'adm_c3sl': "Administrador C3SL"
}

function getName(key, arr) {
    for (var i in arr) {
        if (arr[i].id == key) {
            return arr[i].name;
        }
    }
    return '';
}

function tableList() {

  if(!this.state.professional.roles || this.state.professional.roles.length == 0) {
    return ( <div /> )
  }

  const data = (
    this.state.professional.roles.map((service_place,index) => {
      return (
        <tr>
          <td>
            {getName(service_place.service_place_id, this.state.aux.service_places)}
          </td>
          <td>
            {role_name[service_place.role]} 
          </td>
          <td>
            <a className='back-bt waves-effect btn-flat'
               href='#'
               onClick={ () =>
                  this.setState({
                    professional: update(this.state.professional, {roles: {$splice: [[index,1]] } })
                  })
               }
            >
              <i className="waves-effect material-icons tooltipped">
                delete
              </i>
            </a>
          </td>
        </tr>
      )
    })
  )

  const fields = (
    <tr>
      <th>Local</th>
      <th>Permissão</th>
      <th></th>
    </tr>
  )

  return (
    <table className={styles['table-list']}>
      <thead>
        {fields}
      </thead>
      <tbody>
        {data}
      </tbody>
    </table>
  )
}

function insertServicePlace() {
  if(this.state.aux.permission_id && this.state.aux.service_place_id) { 
    var element = { 
                    'role': this.state.aux.permission_id,
                    'service_place_id': this.state.aux.service_place_id
                  }
    if(!this.state.professional.roles.some((role) => { 
        return (
          role['role'] == element['role'] 
          && role['service_place_id'] == element['service_place_id']
        ) 
      })) 
    {
      var array_roles = this.state.professional.roles
      array_roles.push(element)
      this.setState({
        professional: update(this.state.professional, {roles: {$set: array_roles } })
      })
    }
  }
}

export default function () {
  return (
    <div>
      <Row s={12}></Row>

      <div className='category-title'>
        <p>Dados de Profissional</p>
      </div>

      <Row s={12}>
        {pickOccupation.bind(this)()}
      </Row>

      <Row s={12}>
        <div className="field-input">
          <h6>Matrícula:</h6>
          <label>
            <input
              type="text"
              name="registration"
              pattern="[0-9|/]*"
              value={this.state.professional.registration}
              onChange={handleInputProfessionalChange.bind(this)}
            />
          </label>
        </div>
      </Row>

      { (this.props.current_professional) ? null :
        <div>
          <Row></Row>
          <Row s={12}>
            {pickServicePlace.bind(this)()}
          </Row>
          <Row s={12}>
            {pickPermission.bind(this)()}
          </Row>
          <Row s={12}>
            <Button floating large className='green' waves='light' icon='add' onClick={insertServicePlace.bind(this)} />
          </Row>
          <Row s={12}>
            {tableList.bind(this)()}
          </Row>
        </div>
      }
    </div>
  )
}
