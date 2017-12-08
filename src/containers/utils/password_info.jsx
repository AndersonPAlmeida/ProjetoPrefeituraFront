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
      <div className='category-title'>
        <p>Senha</p>
      </div>

      <div className="field-input">
        <h6>Senha atual:</h6>
        <label>
          <input 
            type="password"
            className='input-field' 
            name="password"
            value={this.state.aux.password}
            onChange={this.handleChange.bind(this)} 
          />
        </label>
      </div>
      
      <div className="field-input">
        <h6>Confirmação de senha:</h6>
        <label>
          <input 
            type="password" 
            className='input-field'
            name="password_confirmation" 
            value={this.state.aux.password_confirmation}
            onChange={this.handleChange.bind(this)}
          />
        </label>
      </div>
      {this.props.is_edit ?
        <div className="field-input">
          <h6>Nova senha: <i>(mínimo 6 caracteres)</i></h6>
          <label>
            <input
              type="password"
              className='input-field'
              name="current_password"
              value={this.state.aux.current_password}
              onChange={this.handleChange.bind(this)}
            />
          </label>
        </div>
      : null}
    </Col>
  )
}
