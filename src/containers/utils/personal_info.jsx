import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import { UserImg } from '../images';
import MaskedInput from 'react-maskedinput';
import {fetch} from "../../redux-auth";
import { browserHistory } from 'react-router';

export default function () {
  return (
    <Col s={12} m={12} l={6}>
      <div>
        <img
          id='user_photo'
          width='230'
          height='230'
          src={this.state.aux.photo_obj}
        />
        <div className='file-input'>
          <Input
            type='file'
            name='photo'
            accept='image/*'
            onChange={this.handleFile.bind(this)}
          />
        </div>
      </div>
      <div className="field-input" >
        <h6>Nome*:</h6>
        <label>
          <input type="text" name="name" className='input-field' value={this.state.user.name} onChange={this.handleInputUserChange.bind(this)} />
        </label>
      </div>
      <div className="field-input" >
        <h6>Data de nascimento*:</h6>
        {this.selectDate()}
      </div>

      <div className="field-input" >
        <h6>Possui algum tipo de deficiência:</h6>
        <div className="check-input">
          <Input
            onChange={this.handleChange.bind(this)}
            checked={this.state.aux.pcd_value}
            s={12} l={12}
            name='pcd_value'
            type='radio'
            value='true'
            label='Sim'
          />
          <Input
            onChange={this.handleChange.bind(this)}
            checked={!this.state.aux.pcd_value}
            s={12} l={12}
            name='pcd_value'
            type='radio'
            value=''
            label='Não'
          />

          { this.state.aux.pcd_value ?
            <div>
              <h6>Qual tipo de deficiência:</h6>
              <label>
                <input
                  type="text"
                  className='input-field'
                  name="pcd"
                  value={this.state.user.pcd}
                  onChange={this.handleInputUserChange.bind(this)}
                  />
              </label>
            </div>
            : null
          }
        </div>
      </div>

      <div className="field-input">
        <h6>CPF:</h6>
        <label>
          <MaskedInput
            type="text"
            className='input-field'
            mask="111.111.111-11"
            name="cpf"
            value={this.state.user.cpf}
            onChange={this.handleInputUserChange.bind(this)}
          />
        </label>
      </div>

      <div className="field-input">
        <h6>RG{this.props.user_class == `dependant` ? '' : '*'}:</h6>
        <label>
          <MaskedInput
            type="text"
            className='input-field'
            mask="11.111.111-1"
            name="rg"
            value={this.state.user.rg}
            onChange={this.handleInputUserChange.bind(this)}
          />
        </label>
      </div>
    </Col>
  )
}
