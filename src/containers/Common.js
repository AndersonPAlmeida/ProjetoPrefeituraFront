import React, {Component} from 'react'
import LogoImage from '../../public/logo.png'
import styles from './styles/Home.css'
import { Button, Card, Row, Col } from 'react-materialize'
import McImg from '../../public/mc_logo.png'
import LogoImg from '../../public/logo.png'


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
export const Footer = () => (
        <div className={styles['footer']}>
          <div className={styles['top-footer']}>
            <Row>
              <Col s={12} m={12} l={12}>
                <div>
                  <p> Manual </p>
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

export const NavBar = () => (
    <nav className="white">
      <div className="nav-wrapper container">
        <div className="brand-logo center-align">   
          <img
               className={styles['nav-logo']}
               src={LogoImg} />
          <h2 className='right city-name'> São José dos Pinhais </h2>
        </div>
      </div>
      <div className="progress">
        <div></div>
      </div>
    </nav>
)