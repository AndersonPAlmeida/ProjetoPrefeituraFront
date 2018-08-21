import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import MaskedInput from 'react-maskedinput';
import { Button, Card, Row, Col, Dropdown, Input, CardPanel } from 'react-materialize'
import styles from './styles/PasswordChange.css'

export class InvalidToken extends React.Component {

  constructor(props) {
     super(props);

   }

  prev() {
    browserHistory.push(`/`)
  }


  confirmButton() {
    return (
      <div className="card-action">
        <a className='back-bt waves-effect btn-flat'
           href='#'
           onClick={this.prev}
        >
          Voltar
        </a>
      </div>
    )
  }


  render() {
    return(
      <main>
          <Row s={12}>
            <div className='card'>
              <div className='card-content'>
                <Row className='first-line'>
                <h4>Seu link para recuperar a senha é inválido</h4>
                </Row>
                <Row>
                  {this.confirmButton()}
                </Row>
              </div>
            </div>
          </Row>
      </main>
    )
  }
}
export default InvalidToken;
