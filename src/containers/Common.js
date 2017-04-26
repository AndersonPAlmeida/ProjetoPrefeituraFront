import React, {Component} from 'react'
import LogoImage from '../../public/logo.png'
import styles from './styles/Home.css'
import { Button, Card, Row, Col, Dropdown, NavItem, Navbar } from 'react-materialize'
import McImg from '../../public/mc_logo.png'
import LogoImg from '../../public/logo.png'
import UserImg from '../../public/user.png'


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

export const NaveBar = () => (
    <nav className="white">
      <div className={styles['nav-width'] + " nav-wrapper container"}>
        <div className="nav-brand center-align">   
          <a>
            <img
                 className={styles['nav-logo']}
                 src={LogoImg} />
          </a>
            <h2 className="city-name right hide-on-med-and-down left-align"> São José dos Pinhais </h2>
        </div>
        <a className="right black-text logout-icon modal-trigger" title="Sair" data-target="">
          <i className="material-icons">exit_to_app</i>
        </a>
        <a data-activates="notifications-menu" href="" className="button-notifications black-text right" title="Notificações">
          <span className="mdl-badge no-notification" data-badge="0">
            <i className="material-icons" id="notification-icon">notifications</i>
          </span>
        </a>
        <ul className="right hide-on-med-and-down large-menu" id="nav-ul">
          <li>
            <a href="">Efetuar Agendamento</a>
          </li>
          <li>
            <a href="">Histórico</a>
          </li>
          <li>
            <Dropdown trigger={
                <a>
                  <span className="user-name left">Administrador MPOG</span>
                  <img 
                    alt="Administrador MPOG" 
                    className="material-icons circle profile-pic right" 
                    src={UserImg} />
                  <i className="material-icons right">arrow_drop_down</i> 
                </a>
              }>
              <NavItem>Cidadão<p className='nav-p'>Brasília</p></NavItem>
              <NavItem>Mudar Permissão</NavItem>
              <NavItem divider />
              <NavItem>Editar</NavItem>
              <NavItem>Dependentes</NavItem>
              <NavItem>Imprimir Cadastro</NavItem>
              <NavItem divider />
              <NavItem>Sair</NavItem>
            </Dropdown>
          </li>
        </ul>
      </div>
      <div>
      </div>
      <div className="progress">
        <div></div>
      </div>
    </nav>
)