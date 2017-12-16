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
        <p>Endereço</p>
      </div>

      <div className="field-input" >
        <h6>CEP{this.props.user_class == `dependant` ? '' : '*'}:</h6>
        <label>
          <MaskedInput
            type="text"
            className='input-field'
            mask="11111-111" name="cep"
            value={this.state.user.cep}
            onChange=
            {
              (event) => {
                this.handleInputUserChange.bind(this)(event)
                var cep = event.target.value.replace(/(\.|-|_)/g,'')
                if(cep.length == 8)
                  this.updateAddress.bind(this)(cep)
              }
            }
          />
        </label>
      </div>

      <div className="field-input" >
        <h6>Estado do endereço:</h6>
        <label>
          <input
            type="text"
            className='input-field'
            name="state_abbreviation"
            value={this.state.aux.state_abbreviation}
            disabled />
        </label>
      </div>

      <div className="field-input" >
        <h6>Munícipio:</h6>
        <label>
          <input
            type="text"
            className='input-field'
            name="city"
            value={this.state.aux.city_name}
            disabled
          />
        </label>
      </div>
      <div className="field-input" >
        <h6>Bairro:</h6>
        <label>
          <input
            type="text"
            className='input-field'
            name="neighborhood"
            value={this.state.aux.neighborhood}
          />
        </label>
      </div>
      <div className="field-input" >
        <h6>Endereço:</h6>
        <label>
          <input
            type="text"
            className='input-field'
            name="address"
            value={this.state.aux.address}
          />
        </label>
      </div>

      <div className="field-input" >
        <h6>Número:</h6>
        <label>
          <input
            type="text"
            className='input-field'
            name="address_number"
            pattern="[0-9]*"
            value={this.state.user.address_number}
            onChange={this.handleInputUserChange.bind(this)}
          />
        </label>
      </div>

      <div className="field-input" >
        <h6>Complemento:</h6>
        <label>
          <input
            type="text"
            className='input-field'
            name="address_complement"
            value={this.state.user.address_complement}
            onChange={this.handleInputUserChange.bind(this)} />
        </label>
      </div>
    </Col>
  )
}
