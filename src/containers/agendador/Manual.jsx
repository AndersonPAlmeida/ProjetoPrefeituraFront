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
import { Button, Card, Row, Col, Icon } from 'react-materialize'
import styles from './styles/Manual.css'
import { browserHistory } from 'react-router';


class Manual extends Component {
    manual_file() {
          browserHistory.push(`/manual/manual.pdf`)
    }

    manualText(){
        return(
            <div>
              <div>
                <div className={styles['info-text']}>
                    <div className='card'>
                      <div className='card-content'>
                        <h2 className='card-title h2-title-home'> Manual</h2>
                        <p> O Manual do sistema descreve como utilizá-lo detalhadamente e pode ser acessado pelo botão abaixo </p>
                        <Row>
                            <a  className="waves-effect button-color new-upload-button send-button btn" onClick={this.manual_file.bind(this)} > <i  className="material-icons"> import_contacts </i> MANUAL</a>
                        </Row>
                      </div>
                    </div>
                </div>
              </div>
            </div>
        )
    }

  render() {
    return (
      <div>
        <div className={styles['main']}>
          <Row>
            <Col s={12} m={12} l={12}>
              {this.manualText()}
            </Col>
          </Row>
        </div>
      </div>
    )
  }

}

export default Manual
