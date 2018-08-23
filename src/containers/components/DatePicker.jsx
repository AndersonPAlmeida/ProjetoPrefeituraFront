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
import styles from './styles/datepicker.css'
import { Input } from 'react-materialize'

/**
  Min: first selectable date
  Max: last selectable date
  formatSubmit: format in which the date will be sent to server.
  Min, max and formatSubmit are specified here:
  http://amsul.ca/pickadate.js/date/
*/

class DatePicker extends Component {
  constructor(props) {
      super(props)
      let min = false;
      let max = false;
      let format = 'yyyy/mm/dd';

      if(this.props.min != undefined)
        min = this.props.min;

      if(this.props.max != undefined)
        max = this.props.max;

      if(this.props.format != undefined)
        format = this.props.format;

      this.state = {
        min: min,
        max: max,
        format: format
      };
  }
  render(){
    return(
        <Input
          name={this.props.name}
          type='date'
          value={this.props.value}
          className='date'
          options={
            {
              monthsFull: [ 'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro' ],
              monthsShort: [ 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez' ],
              weekdaysFull: [ 'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado' ],
              weekdaysShort: [ 'd', 's', 't', 'q', 'q', 's', 's' ],
              labelMonthNext: 'Próximo mês',
              labelYearSelect: 'Selecione um ano',
              labelMonthPrev: 'Mês anterior',
              labelMonthSelect: 'Selecione um mês',
              today: 'hoje',
              clear: 'limpar',
              close: 'fechar',
              format: this.state.format,
              min: this.state.min,
              max: this.state.max
            }
          }
          onChange={this.props.onChange}
          />
    )
  }

}

export default DatePicker;
