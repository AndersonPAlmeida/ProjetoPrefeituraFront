/*
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
 */

import React, {PropTypes} from "react";
import Immutable from "immutable";
import MaskedInput from 'react-maskedinput';
import { Input as M_Input } from 'react-materialize';

class AuthInput extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    errors: PropTypes.object
  };

  static defaultProps = {
    label: "",
    value: null,
    errors: Immutable.fromJS([])
  };

  handleInput (ev) {
    this.props.onChange(ev.target.value);
  }

  renderErrorList () {
    if (this.props.errors.size) {
      return (
        <div className='auth-error-message'>
          {this.props.errors.map((err, i) => {
            return (
              <p className="inline-error-item"
                 style={{paddingLeft: "20px", position: "relative", marginBottom: "28px"}}
                 key={i}>
                <i style={{
                  position: "absolute",
                  left: 0,
                  top: 0}}>{"✗"}</i>
                {this.props.label} {err}
              </p>
            );
          })}
        </div>
      );
    } else {
      return null;
    }
  }

  render () {
    var { errors, materializeComp, ...other } = this.props;
    if (other.value == null) {
      other.value = '';
    }
    { 
      if(this.props.mask) {
        return (
          <div>
            <label>{this.props.label}</label>
            <MaskedInput
            {...other}
            onChange={this.handleInput.bind(this)} />
            {this.renderErrorList()}
          </div>
        ); 
      }
      else if(this.props.materializeComp) {
        return (
          <div>
            <M_Input
            {...other}
            onChange={this.handleInput.bind(this)} />
            {this.renderErrorList()}
          </div>
        );
      }
      else {
        return (
          <div>
            <label>{this.props.label}</label>
            <input
            {...other}
            onChange={this.handleInput.bind(this)} />
            {this.renderErrorList()}
          </div>
        );
      }
    }
  }
}

export default AuthInput;
