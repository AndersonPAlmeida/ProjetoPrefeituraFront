import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/OccupationShow.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';

class getOccupationShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      occupation: []
    }
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `occupations/${this.props.params.occupation_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      this.setState({ occupation: resp })
    });
  }

  mainComponent() {
    return (
      <div className='card'>
            <div className='card-content'>
              <h2 className='card-title h2-title-home'> Informações do Cargo: </h2>
              <p>
                <b>Situação: </b>
                {this.state.occupation.active ? 'Ativo' : 'Inativo'}
              </p>
              <p>
                <b>Nome: </b>
                {this.state.occupation.name}
              </p>
              <p>
                <b>Descrição: </b>
                {this.state.occupation.description}
              </p>
              <p>
                <b>Prefeitura: </b>
                {this.state.occupation.city_hall_name}
              </p>
            </div>
            {this.editButton()}
        </div>
    )
  }

  editOccupation () {
    browserHistory.push(`occupations/${this.props.params.occupation_id}/edit`)
  }

  prev() {
    browserHistory.push(`occupations`)
  }

	editButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
				<button className="waves-effect btn right" name="commit" onClick={this.editOccupation.bind(this)} type="submit">Editar</button>
      </div>
		)
	}

  render() {
    return (
      <main>
      	<Row>
	        <Col s={12}>
		      	<div>
              {this.mainComponent()}
		      	</div>
	      	</Col>
	    </Row>
	  </main>
    )
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  return {
    user
  }
}
const OccupationShow = connect(
  mapStateToProps
)(getOccupationShow)
export default OccupationShow
