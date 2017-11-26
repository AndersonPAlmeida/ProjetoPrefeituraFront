import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, NavItem, Navbar } from 'react-materialize'
import styles from './styles/ChooseRole.css'
import { LocalIcon, CitizenIcon, ProfessionalIcon } from '../images'
import { connect } from 'react-redux'
import {userUpdate} from "../../actions/user"
import { browserHistory } from 'react-router';

const role_name = {
  'citizen': "Cidadão",
  'responsavel_atendimento': "Responsável Atendimento",
  'atendente_local': "Atendente Local",
  'adm_local': "Administrador Local",
  'adm_prefeitura': "Administrador Prefeitura",
  'adm_c3sl': "Administrador C3SL"
}
class getChooseRole extends Component {
	firstComponent() {
		return (
			<div className='card'>
	          <div className='card-content center'>
	            <h2 className='card-title h2-title-home'> {this.props.user.citizen.name}, 
	            	escolha o local e a permissão os quais deseja acessar:! </h2>
	          </div>
	    	</div>
		)
	}
  
  handleClick(selected_role, idx) {
    var index;
    var path;
    if(selected_role.id == 'citizen') {
      index = -1;
      path = 'citizens/schedules/history?home=true'
    }
    else {
      index = idx;
      path = '/professionals/shifts?home=true'
    }
    this.props.dispatch(userUpdate({ 'current_role': selected_role.id, 'current_role_idx': index }))
    localStorage.setItem("current_role", selected_role.id)
    localStorage.setItem("current_role_idx", index)
    browserHistory.push(path)
  }

	rolesPlaces() {
		var rolesOptions = [];
		var iconImg = ProfessionalIcon
		for (var i in this.props.options) {
			if (this.props.options[i].role == 'citizen'){
				iconImg = CitizenIcon
			} else {
				iconImg = ProfessionalIcon
			}
			rolesOptions.push(
        <Col className="col-role-place" s={12} m={6}>
				  <li className="role-place concrete-flat-button card hoverable waves-effect" onClick={this.handleClick.bind(this, this.props.options[i],i)}>
					  <div className="card-content">
						  <div className='img-roles'>
							  <img src={LocalIcon} />
							</div>
							<div className="text-chose-role truncate">
				        {this.props.options[i].city_name}
				      </div>
				    </div>
						<div className="card-content">
							<div className='img-roles'>
								<img src={iconImg} />
							</div>
							<div className="text-chose-role truncate">
				        {role_name[this.props.options[i].role]}
				      </div>
            </div>
          </li>
        </Col>
			)
		}
		return (
			<div>
				<ul>
					{rolesOptions}
				</ul>
			</div>
		)
	}	

  render() {
    return (
      <div>
	      <main>
	      	<Row>
		        <Col s={12}>
			      	<div>
			      		{this.firstComponent()}
			      	</div>
			      	<div>
			      		{this.rolesPlaces()}
			      	</div>
		      	</Col>
		    </Row>
		  </main>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  const citizen_role = [{ 'id': "citizen", 'role': "citizen", 'city_id': user.citizen.city.id, 'city_name': user.citizen.city.name }] 
  var options
  if(user.roles)
    options = user.roles.concat(citizen_role)
  else
    options = citizen_role
  return {
    user,
    options
  }
}

const ChooseRole = connect(
  mapStateToProps
)(getChooseRole)
export default ChooseRole 
