import React, {Component} from 'react'
import LogoImage from '../../public/logo.png'
import styles from './styles/Home.css'
import Login from './Login'
import { Button, Card, Row, Col } from 'react-materialize'
import McImg from '../../public/mc_logo.png'

export const GovernmentBar = () => (
        <div className={styles['government-bar']}>
          <ul>
            <li>
              Portal do Governo
            </li>
            <li>
              Atualize sua barra do Governo
            </li>
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
export default class Home extends React.Component {
  render() {
    return (
      <div>
        <GovernmentBar />
        <div>
          <Header />
          <Login />
          <Footer />
        </div>
      </div>
    )
  }
}
