import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, NavItem, Navbar } from 'react-materialize'
import styles from './styles/Menu.css'
import { getOptions } from '../utils/menu.js'
import { UserImg, LogoImage } from '../images'
import { browserHistory } from 'react-router';

class Menu extends Component {
  constructor(props) {
    super(props);
  }

  handleClick(path) {
    browserHistory.push(path)
  }

  NavComponents(props) {
    var navOptions = []
    for (var i in props) {
      var navDropDown = []
      if (props[i].rolldown) {
        for (var j in props[i].fields){
          navDropDown.push(
            <NavItem key={(props[i].fields[j].link)+i+j} className={styles['nav-item-li']} onClick={this.handleClick.bind(this, props[i].fields[j].link)}>{props[i].fields[j].name}</NavItem>
          )
          if(props[i].fields[j].separator){
            navDropDown.push(<NavItem key={"sep"+i+j}divider />)
          }
        }
        navOptions.push(
          <li key={(props[i].name)+i} className={styles['nav-item']}>
            <Dropdown trigger={
              <a> 
                <span> {props[i].name} </span>
                {props[i].img ? 
                <img 
                  alt="Administrador MPOG" 
                  className="material-icons circle profile-pic right" 
                  src={UserImg} /> : "" 
                }
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
          <NavItem key={(props[i].link)+i+j} className={styles['nav-item']} onClick={this.handleClick.bind(this, props[i].link)}> {props[i].name} </NavItem>
        );
      }
    }
    return(navOptions)
  }
  
  render() {
    return (
      <div className='body-div'> 
        <Navbar className= 'nav-bar container nav-component' right 
          brand={ <img className='nav-logo' src={LogoImage} /> }>
          <a className="right black-text logout-icon modal-trigger" title="Sair" data-target="">
            <i className="material-icons">exit_to_app</i>
          </a>
          {this.NavComponents(getOptions(this.props.permission,this.props.name))}
        </Navbar>
        <div className="progress">
          <div></div>
        </div>
      </div>
    )
  }
}

export default Menu
