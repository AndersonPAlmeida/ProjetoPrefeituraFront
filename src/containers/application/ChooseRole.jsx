import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, NavItem, Navbar } from 'react-materialize'
import styles from './styles/ChooseRole.css'
import { LocalIcon, CitizenIcon, ProfessionalIcon } from '../images'
import { connect } from 'react-redux'
import {userUpdate} from "../../actions/user"
import { browserHistory } from 'react-router';

class getChooseRole extends Component {
	firstComponent() {
		return (
			<div className='card'>
	          <div className='card-content center'>
	            <h2 className='card-title h2-title-home'> "Nome usuário", 
	            	escolha o local e a permissão os quais deseja acessar:! </h2>
	          </div>
	    	</div>
		)
	}
  
  handleClick(role) {
    this.props.dispatch(userUpdate({ 'current_role': role }))
    browserHistory.push('/pageone')
  }

	rolesPlaces() {
		var rolesOptions = [];
		var iconImg = ProfessionalIcon
		for (var i in this.props.options) {
			if (this.props.options[i].id == 'citizen'){
				iconImg = CitizenIcon
			} else {
				iconImg = ProfessionalIcon
			}
			rolesOptions.push(
        <Col className="col-role-place" s={12} m={6}>
				  <li className="role-place concrete-flat-button card hoverable waves-effect" onClick={this.handleClick.bind(this, this.props.options[i])}>
					  <div className="card-content">
						  <div className='img-roles'>
							  <img src={LocalIcon} />
							</div>
							<div className="text-chose-role truncate">
				        {this.props.options[i].city}
				      </div>
				    </div>
						<div className="card-content">
							<div className='img-roles'>
								<img src={iconImg} />
							</div>
							<div className="text-chose-role truncate">
				        {this.props.options[i].name}
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
  const options = [
            { 'id': "adm_prefeitura", 'name': "Administrador da Prefeitura", 'city': "Curitiba", 'city_id': 1 },
            { 'id': "citizen", 'name': "Cidadão", 'city': "São José dos Pinhais", 'city_id': 2 }
          ];
  return {
    options
  }
}

const ChooseRole = connect(
  mapStateToProps
)(getChooseRole)
export default ChooseRole 
