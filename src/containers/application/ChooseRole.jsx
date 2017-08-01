import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, NavItem, Navbar } from 'react-materialize'
import styles from './styles/ChooseRole.css'
import NavMenu from './NavMenu.jsx'
import LocalIcon from '../../public/place-mark.png'
import CitizenIcon from '../../public/citizen1.png'
import ProfessionalIcon from '../../public/professional1.png'
import options_array from './utils/roles.js'
var options = options_array.options

class ChooseRole extends Component {

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

	rolesPlaces() {
		var rolesOptions = [];
		var iconImg = ProfessionalIcon
		for (var i in options) {
			if (options[i].professional){
				iconImg = ProfessionalIcon
			} else {
				iconImg = CitizenIcon
			}
			rolesOptions.push(
				<Col className="col-role-place" s={12} m={6}>
					<li className="role-place concrete-flat-button card hoverable waves-effect">
						<div className="card-content">
							<div className='img-roles'>
								<img 
									src={LocalIcon} />
							</div>
							<div className="text-chose-role truncate">
				              {options[i].local}
				            </div>
				        </div>
						<div className="card-content">
							<div className='img-roles'>
								<img 
									src={iconImg} />
							</div>
							<div className="text-chose-role truncate">
				              {options[i].role}
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
      	<NavMenu /> 
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

export default ChooseRole 
