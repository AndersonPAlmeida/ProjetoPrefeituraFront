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
import { Input } from 'react-materialize'
import MaskedInput from 'react-maskedinput';
import {fetch} from "../../redux-auth";
import { browserHistory } from 'react-router';
import update from 'react-addons-update';

export default function () {
  return (
    <div>
      <div className='category-title'>
        <p>Informações de Contato</p>
      </div>
      <div className="field-input">
        <h6>Telefone 1{this.props.user_class == `dependant` ? '' : '*'}:</h6>
        <label>
          <MaskedInput
            mask={this.state.aux.phonemask1}
            type="text"
            className='input-field'
            name="phone1" 
            value={this.state.user.phone1} 
            onChange={
              (event) => {
                this.handleInputUserChange.bind(this)(event)
                if(event.target.value.replace(/(_|-|(|))/g,'').length == 14) {
                  this.setState({aux: update(this.state.aux,
                    {
                      phonemask1: {$set: "(11) 11111-1111"},
                    })
                  })
                }
                else {
                  this.setState({aux: update(this.state.aux,
                    {
                      phonemask1: {$set: "(11) 1111-11111"},
                    })
                  })
                }
              }
            }
          />
        </label>
      </div>

      <div className="field-input">
        <h6>Telefone 2:</h6>
        <label>
          <MaskedInput
            mask={this.state.aux.phonemask2}
            type="text"
            className='input-field'
            name="phone2"
            value={this.state.user.phone2}
            onChange={
              (event) => {
                this.handleInputUserChange.bind(this)(event)
                if(event.target.value.replace(/(_|-|(|))/g,'').length == 14) {
                  this.setState({aux: update(this.state.aux,
                    {
                      phonemask2: {$set: "(11) 11111-1111"},
                    })
                  })
                }
                else {
                  this.setState({aux: update(this.state.aux,
                    {
                      phonemask2: {$set: "(11) 1111-11111"},
                    })
                  })
                }
              }
            }
          />
        </label>
      </div>

      <div className="field-input">
        <h6>E-mail:</h6>
        <label>
          <input
            type="text"
            className='input-field'
            name="email"
            value={this.state.user.email}
            onChange={this.handleInputUserChange.bind(this)}
          />
        </label>
      </div>

      <div>
        <h6>Observações:</h6>
        <label>
          <textarea
            className='input-field materialize-textarea'
            placeholder="Deixe este campo em branco caso não exista observações a serem feitas"
            name="note"
            value={this.state.user.note}
            onChange={this.handleInputUserChange.bind(this)}
          />
        </label>
      </div>
    </div>
  )
}
