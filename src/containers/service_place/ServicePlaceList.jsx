import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ServicePlaceList.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';

class getServicePlaceList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          service_places: []
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `service_places`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ service_places: resp })
    });
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Local de Atendimento </h2>
          {this.tableList()}
        </div>
        <div className="card-action">
          {this.newServicePlaceButton()}
        </div>
      </div>
      )
  }
  
	tableList() {
    const data = (
      this.state.service_places.map((service_place) => {
        return (
          <tr>
            <td>
              <a className='back-bt waves-effect btn-flat' 
                href='#' 
                onClick={ () => 
                  browserHistory.push(`/service_places/${service_place.id}`) 
                }>
                {service_place.name}
              </a>
            </td>
            <td>
              {service_place.cep}
            </td>
            <td>
              {service_place.neighborhood}
            </td>
            <td>
              {service_place.state_name}
            </td>
            <td>
              {service_place.city_name}
            </td>
            <td>
              {service_place.phone}
            </td>
            <td>
              {service_place.active ? 'Ativo' : 'Inativo'}
            </td>
            <td>
              <a className='back-bt waves-effect btn-flat' 
                 href='#' 
                 onClick={ () => 
                 browserHistory.push(`/service_places/${service_place.id}/edit`) 
                }>
                  <i className="waves-effect material-icons tooltipped">
                    edit
                  </i>
              </a> 
            </td>
          </tr>
        )
      })
    )

    // Fields to show in the table, and what object properties in the data they bind to
    const fields = (
      <tr>
        <th>Nome</th>
        <th>CEP</th>
        <th>Bairro</th>
        <th>Estado</th>
        <th>Munícipo</th>
        <th>Telefone</th>
        <th>Situação</th>
        <th></th>
      </tr>
    )

    return (
      <table className={styles['table-list']}>
        <thead>
          {fields}
        </thead>
        <tbody>
          {data}
        </tbody>
      </table>
    )
	}

  prev() {
    browserHistory.push("citizens/schedules/agreement")
  }

	newServicePlaceButton() {
		return (
			<button 
        onClick={() =>
          browserHistory.push({ pathname: `/service_places/new`}) 
        }
        className="btn waves-effect btn button-color" 
        name="anterior" 
        type="submit">
          CADASTRAR NOVO LOCAL DE ATENDIMENTO
      </button>
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

const ServicePlaceList = connect(
  mapStateToProps
)(getServicePlaceList)
export default ServicePlaceList
