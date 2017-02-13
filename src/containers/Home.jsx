import React, {Component} from 'react'
import LogoImage from '../../public/logo.png'
import './styles/Home.css'
import Login from './Login'
import { Button, Card, Row, Col } from 'react-materialize'
import McImg from '../../public/mc_logo.png'
export const GovermentBar = () => (
        <div className='goverment-bar'>
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
          <div className='logo-content'> 
              <img
                className='logo-image'
                src={LogoImage} />
              <h5 className='logo-text'> Agendador de Serviços Públicos</h5>
          </div>
        </div>
)
export const Footer = () => (
        <div className='footer'>
          <div className='top-footer'>
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
              className='mc-img'
              src={McImg}
            />
          </div>
        </div>
)
export default class Home extends React.Component {
  render() {
    return (
      <div>
        <GovermentBar />
        <div>
          <Header />
          <Login />
          <Footer />
        </div>
      </div>
    )
  }
}
