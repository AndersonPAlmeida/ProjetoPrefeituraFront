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
import MaskedInput from 'react-maskedinput';


class InputDate extends Component {
    constructor(props) {
        super(props);
        this.state= {
          value: props.value || props.defaultValue,
        }
        var className = 'input-date';
        if(props.className){
          className = `${className} ${props.className}`;
        }
    }


    render() {
        return(
            <div>
              <MaskedInput
                name={this.props.name}
                value={this.props.value}
                className={this.className}
                mask="11/11/1111"
                placeholder='dd/mm/aaaa'
                onChange={(event) => {
                    this.props.onChange(event)
                  }}/>
            </div>
        )
    }
}

export default InputDate
