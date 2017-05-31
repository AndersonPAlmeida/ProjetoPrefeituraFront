import React, {Component} from 'react'
import LogoImage from '../../public/logo.png'
import styles from './styles/Home.css'
import { Button, Card, Row, Col } from 'react-materialize'
import McImg from '../../public/mc_logo.png'
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
    <a key={idx} className='back-bt waves-effect btn-flat' onClick={() => browserHistory.push(item.link)} > {item.name} </a>
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
            <div>
              <img
                className={styles['mc-img']}
                src={McImg}
              />
            </div>
          </div>
  )
}
