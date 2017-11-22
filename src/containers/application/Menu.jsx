import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, NavItem, Navbar } from 'react-materialize'
import styles from './styles/Menu.css'
import { getOptions } from '../utils/menu.js'
import { UserImg, LogoImage } from '../images'
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { userDestroySession } from '../../actions/user.js';

class getMenu extends Component {
  constructor(props) {
    super(props);
  }

  handleClick(path, e) {
    e.preventDefault();
    browserHistory.push(path)
  }

  NavComponents(props) {
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
  
  render() {
    return (
      <div className='body-div'> 
        <Navbar className= 'nav-bar container nav-component' right 
          brand={ <img className='nav-logo' src={LogoImage} /> } href="#">
          <a className="right black-text logout-icon modal-trigger" 
            title="Sair" 
            data-target=""
            href="#"
            onClick={() => {
              this.props.dispatch(userDestroySession(this.getEndpoint()))
            }}>
            <i className="material-icons">exit_to_app</i>
          </a>
          {this.NavComponents(getOptions(this.props.user_role,this.props.user_name))}
        </Navbar>
        <div className="progress">
          <div></div>
        </div>
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
    user_name,
    user_role,
    auth 
  }
}

const Menu = connect(
  mapStateToProps
)(getMenu)
export default Menu
