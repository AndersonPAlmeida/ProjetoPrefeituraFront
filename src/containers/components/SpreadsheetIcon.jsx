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
import styles from './styles/SpreadsheetIcon.css'


class SpreadsheetIcon extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return(
            <div>
                <img className='spreadsheet-img' src={this.props.icon} alt={this.props.alt} />
                <a id="download-button" onClick={this.props.function} className="waves-effect button-green btn"><i className="material-icons left">file_download</i>{this.props.children}</a>
            </div>
        )
    }
}

export default SpreadsheetIcon
