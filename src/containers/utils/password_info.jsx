import React, {Component} from 'react'
import { Link } from 'react-router'
import {fetch} from "../../redux-auth";
import { browserHistory } from 'react-router';

export default function () {
  return (
    <div>
      <div className='category-title'>
        <p>Senha</p>
      </div>

      <div className="field-input">
        <h6>Senha{(!this.props.edit) ? '*' : ''}:</h6>
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
        <h6>Confirmação de senha{(!this.props.edit) ? '*' : ''}:</h6>
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
    </div>
  )
}
