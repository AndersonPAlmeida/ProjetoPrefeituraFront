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
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, NavItem, Navbar } from 'react-materialize'
import styles from './styles/Menu.css'
import { getOptions } from '../utils/menu.js'
import { UserImg, LogoImage } from '../images'
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { userDestroySession } from '../../actions/user.js';
import {fetch} from "../../redux-auth";
import { port, apiHost, apiPort, apiVer } from '../../../config/env';

class getMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      photo: null
    }
  }

  componentDidMount() {
    var self = this
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const params = `permission=${this.props.user.current_role}`
    const collection = `citizens/${this.props.user.citizen.id}/picture`

    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "get"
    })
      .then(resp => {
        var contentType = resp.headers.get("content-type");
        if(resp.status == 200 && contentType && contentType.indexOf("image") !== -1) {
          resp.blob().then(photo => {
            self.setState({ photo: URL.createObjectURL(photo), fetching: false });
          })
        } else {
          self.setState({ photo: UserImg, fetching: false });
        }
    }).catch(e => {})
  }

  handleClick(path, e) {
    e.preventDefault();
    browserHistory.push(path)
  }

  NavComponents(props, img) {
    var navOptions = []
    for (var i in props) {
      var navDropDown = []
      if (props[i].rolldown) {
        for (var j in props[i].fields){
          navDropDown.push(
            <NavItem key={(props[i].fields[j].link)+i+j} className={styles['nav-item-li']} href="#" onClick={this.handleClick.bind(this, props[i].fields[j].link)}>{props[i].fields[j].name}</NavItem>
          )
          if(props[i].fields[j].separator){
            navDropDown.push(<NavItem key={"sep"+i+j}divider />)
          }
        }
        if(props[i].sign_out) {
          navDropDown.push(
            <NavItem key={'sign_out'} className={styles['nav-item-li']} href="#" onClick={this.signOut.bind(this)} >Sair</NavItem>
          )
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
                  src={img} /> : "" 
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
          <NavItem key={(props[i].link)+i+j} className={styles['nav-item']} href="#" onClick={this.handleClick.bind(this, props[i].link)}>{props[i].name}</NavItem>
        );
      }
    }
    return(navOptions)
  }

  getEndpoint () {
    return (
      this.props.endpoint ||
      this.props.auth.getIn(["configure", "currentEndpointKey"]) ||
      this.props.auth.getIn(["configure", "defaultEndpointKey"])
    );
  }

  goToIndex(e) {
    e.preventDefault();
    let path = ''
    if(this.props.user_role == `citizen`) 
      path = `/citizens/schedules/history?home=true`
    else
      path = `/professionals/shifts?home=true`
    browserHistory.push(path)
  }

  signOut(e) {
    e.preventDefault();
    this.props.dispatch(userDestroySession(this.getEndpoint()))
  }
  
  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> :
            <div className='body-div'> 
              <Navbar className= 'nav-bar container nav-component' right 
                brand={ <img className='nav-logo' src={LogoImage} onClick={this.goToIndex.bind(this)} /> } href="#">
                <a className="right black-text logout-icon modal-trigger" 
                  title="Sair" 
                  data-target=""
                  href="#"
                  onClick={this.signOut.bind(this)}>
                  <i className="material-icons">exit_to_app</i>
                </a>
                {this.NavComponents(getOptions(this.props.user_role,this.props.user_name),this.state.photo)}
              </Navbar>
              <div className="progress">
                <div></div>
              </div>
            </div>
        }
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  const user_name = user.citizen.name
  const auth = state.get('auth')
  var user_role;
  user_role = user.current_role == 'citizen' ? 'citizen' : user.roles[user.current_role_idx].role
  return {
    user,
    user_name,
    user_role,
    auth
  }
}

const Menu = connect(
  mapStateToProps
)(getMenu)
export default Menu
