import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import { UserImg } from '../images';
import MaskedInput from 'react-maskedinput';
import {fetch} from "../../redux-auth";
import { browserHistory } from 'react-router';
import update from 'react-addons-update';

function handleInputProfessionalChange(event) {
  const target = event.target;
  const value = target.value;
  const name = target.name;
  this.setState({
    professional: update(this.state.professional, { [name]: {$set: value} })
  })
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
    <div className='select-field'>
      <h6>Cargo*:</h6>
      <br></br>
      <div>
        <Row className='sector-select'>
          <Input s={12} l={4} m={12} name="occupation_id" type='select' value={this.state.professional.occupation_id}
            onChange={handleInputProfessionalChange.bind(this)}
          >
            <option value='0' disabled>Escolha o cargo</option>
            {occupationsList}
          </Input>
        </Row>
      </div>
    </div>
  )
}

function pickPermission() {
  const permissionsList = (
    this.state.aux.permissions.map((permission) => {
      return (
        <option value={permission.id}>{permission.name}</option>
      )
    })
  )
  return (
    <div className='select-field'>
      <h6>Permissão:</h6>
      <br></br>
      <div>
        <Input s={12} l={4} m={12} name="permission_id" type='select' value={this.state.aux.permission_id}
          onChange={this.handleChange.bind(this)}
        >
          <option value='0' disabled>Escolha a permissão</option>
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
        <option value={service_place}>{service_place.name}</option>
      )
    })
  )
  return (
    <div className='select-field'>
      <h6>Local de Atendimento:</h6>
      <br></br>
      <div>
        <Input s={6} l={4} m={12} name="service_place_id" type='select' value={this.state.aux.service_place_id}
          onChange={this.handleChange.bind(this)}
        >
          <option value={{}} disabled>Escolha o local de atendimento</option>
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

function tableList() {
  const data = (
    this.state.professional.roles.map((service_place,index) => {
      return (
        <tr>
          <td>
            service_place.name
          </td>
          <td>
            role_name[service_place.role] 
          </td>
          <td>
            <a className='back-bt waves-effect btn-flat'
               href='#'
               onClick={ () =>
                  this.setState({
                    professional: update(this.state.professional, {roles: {$splice: [[index,1]] } })
                  })
               }>
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
    <table>
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
  var element = { 
              'role': this.state.aux.permission_id,
              'name': this.state.aux.service_place.name,
              'id': this.state.aux.service_place.id
            }
  this.setState({
    professional: update(this.state.professional, {roles: {$set: this.state.professional.roles.push(element) } })
  })
}

export default function () {
  return (
    <Col s={12} m={12} l={12}>
      <div className='category-title'>
        <p>Dados de Profissional</p>
      </div>

      {pickOccupation.bind(this)()}

      <div className="field-input">
        <h6>Matrícula:</h6>
        <label>
          <MaskedInput
            type="text"
            className='input-field'
            mask="1111/11"
            name="registration"
            value={this.state.professional.registration}
            onChange={handleInputProfessionalChange.bind(this)}
          />
        </label>
      </div>

      <Row>
        {pickServicePlace.bind(this)()}
      </Row>
      <Row>
        {pickPermission.bind(this)()}
        <Button floating large className='green' waves='light' icon='add' onClick={insertServicePlace.bind(this)} />
      </Row>
      <Row>
        {tableList.bind(this)()}
      </Row>
    </Col>
  )
}
