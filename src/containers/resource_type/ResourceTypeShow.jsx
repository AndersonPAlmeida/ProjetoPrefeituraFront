import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/SectorShow.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';

class getResourceTypeShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sector: {
        active: '',
        absence_max: '',
        blocking_days: '',
        cancel_limt: '',
        description: '',
        name: '',
        previous_notice: '',
        schedules_by_sector: ''
      },
    }
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_types/${this.props.params.resource_type_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ sector: resp })
    });
  }

  mainComponent() {
    return (
      <div className='card'>
            <div className='card-content'>
              <h2 className='card-title h2-title-home'> Informações do Tipo de Recurso: </h2>
              <p> 
                <b>Situação: </b>
                {this.state.sector.active ? 'Ativo' : 'Inativo'}
              </p>
              <p> 
                <b>Nome: </b>
                {this.state.sector.name}
              </p>
              <p> 
                <b>Descrição: </b>
                {this.state.sector.description}
              </p>
              <p> 
                <b>Recurso móvel: </b>
                {this.state.sector.active ? 'Sim' : 'Não'}
              </p>
            </div>
            {this.editButton()}
        </div>
    )
  }

  editSector () {
    browserHistory.push(`sectors/${this.props.params.sector_id}/edit`)
  }

  prev() {
    browserHistory.push(`sectors`)
  }  

	editButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
				<button className="waves-effect btn right" name="commit" onClick={this.editSector.bind(this)} type="submit">Editar</button>
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
const ResourceTypeShow = connect(
  mapStateToProps
)(getResourceTypeShow)
export default ResourceTypeShow
