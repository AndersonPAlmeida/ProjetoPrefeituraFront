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

import React, {Component} from 'react'
import styles from './styles/Home.css'
import { Button, Card, Row, Col, Dropdown, NavItem, Navbar } from 'react-materialize'
import { McImg, LogoImage } from '../images'
import { browserHistory } from 'react-router';

export const GovernmentBar = () => (
        <div className="show-on-large-only government-bar">
          <ul>
              <li><a href="http://brasil.gov.br">Portal do Governo Brasileiro</a></li>
              <li><a href="http://epwg.governoeletronico.gov.br/barra/atualize.html">Atualize sua Barra de Governo</a></li>
          </ul>
        </div>
)
export const Header = () => (
        <div>
          <div className={styles['logo-content']}>
              <img
                className={styles['logo-image']}
                src={LogoImage} />
              <h5 className={styles['logo-text']}> Agendador de Serviços Públicos</h5>
          </div>
        </div>
)
export const Footer = (props) =>
{
  const items = props.footerItems;
  const listItems = items.map((item, idx) =>
    <a key={idx} className='back-bt waves-effect btn-flat' onClick={() => window.open(item.link,'_blank')} > {item.name} </a>
  );
  return  (
          <div className={styles['footer']}>
            <div className={styles['top-footer']}>
              <Row>
                <Col s={12} m={12} l={12}>
                  <div>
                    {listItems}
                  </div>
                </Col>
              </Row>
            </div>
            <Row className='align-width'>
              <Col s={12} m={12} l={12}>
                <Col s={2} className='offset-s3'>
                  <img
                    className={styles['mc-img']}
                    src={McImg}
                    />
                </Col>
                <Col s={3}>
                  <div style={{'marginBottom':'10px'}}>
                    <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/br/">
                      <img className='license-img' alt="Licença Creative Commons" style={{'borderWidth':0}}
                        src="https://i.creativecommons.org/l/by-sa/3.0/br/88x31.png" />
                    </a>
                  </div>
                </Col>
                <Col s={12} className='license-text'>
                          <br />
                          Este obra está licenciada com uma Licença <a rel="license"  style={{'color':'#4E6D00'}}
                          href="http://creativecommons.org/licenses/by-sa/3.0/br/">
                          Creative Commons Atribuição-CompartilhaIgual 3.0 Brasil</a>
                </Col>
              </Col>
            </Row>
          </div>
  )
}
