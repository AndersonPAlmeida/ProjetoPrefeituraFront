import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, NavItem, Navbar } from 'react-materialize'
import styles from './styles/PageTwo.css'
import options_array from './Menu.js'
import UserImg from '../../public/user.png'
import LogoImg from '../../public/logo.png'
var options = options_array.options

class PageTwo extends Component {

  constructor(props) {
      super(props);
    }

  NavComponents(props) {
      var navOptions = []
      for (var i in props) {
        var navDropDown = []
        if (props[i].rolldown) {
            for (var j in props[i].fields){
                navDropDown.push(
                  <NavItem className={styles['nav-item-li']} href={props[i].fields[j].link}>{props[i].fields[j].name}</NavItem>
                )
                if(props[i].fields[j].separator){
                  navDropDown.push(<NavItem divider />)
                }
              }
            navOptions.push(
              <li className={styles['nav-item']}>
                <Dropdown trigger={
                    <a> 
                      <span> {props[i].name} </span>
                      {props[i].img ? 
                        <img 
                          alt="Administrador MPOG" 
                          className="material-icons circle profile-pic right" 
                          src={UserImg} /> :
                            "" }
                      <i className="hide1 material-icons right">arrow_drop_down</i>
                    </a>
                  }>
                  {navDropDown}
                </Dropdown>
              </li>
            )
        }
        else { 
          navOptions.push(
            <NavItem className={styles['nav-item']} href={props[i].link}> {props[i].name} </NavItem>
            );
        }
      }
      return(navOptions)
    }
    

  render() {
    return (
      <div className='body-div'> 
        <Navbar className= 'nav-bar container nav-component' right 
            brand={
                  <img className='nav-logo' src={LogoImg} />
              }>
          <a className="right black-text logout-icon modal-trigger" title="Sair" data-target="">
            <i className="material-icons">exit_to_app</i>
          </a>
          {this.NavComponents(options)}
        </Navbar>
        <div className="progress">
          <div></div>
        </div>
      </div>
    )
  }
}

export default PageTwo
