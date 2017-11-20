import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ServiceTypeList.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

class getServiceTypeList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          service_types: []
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `citizens/${this.props.user.citizen.id}/service_types`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ service_types: resp })
    });
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Tipos de Atendimento </h2>
          {this.filterForm()}
          {this.tableList()}
        </div>
        <div className="card-action">
          {this.newServiceTypeButton()}
        </div>
      </div>
      )
  }

  filterForm() {
    return (
      <div>
        <Row className='left filter-box'>
          <Col s={12} m={4} l={4}>
              <h6>Descrição:</h6>
              <label>
                <input 
                  type="text" 
                  className='input-field' 
                  name="description-search" 
                  value="" 
                  />
              </label>
          </Col>
          <Col s={12} m={4} l={4}>
              <h6>Prefeitura:</h6>
              <label>
                <input 
                  type="text" 
                  className='input-field' 
                  name="cityhall-search" 
                  value="" 
                  />
              </label>
          </Col>
          <Col s={12} m={4} l={4}>
              <h6>Situação:</h6>
              <label>
                <input 
                  type="text" 
                  className='input-field' 
                  name="situation-search" 
                  value="" 
                  />
              </label>
          </Col>
        </Row>
      </div>
      )
  }
  
	tableList() {
    const data = (
      this.state.service_types.map((service_type) => {
        return (
          <tr>
            <td>
              <a className='back-bt waves-effect btn-flat' 
                href='#' 
                onClick={ () => 
                  browserHistory.push(`/service_types/${service_type.id}`) 
                }>
                {service_type.description}
              </a>
            </td>
            <td>
              {service_type.situation}
            </td>
            <td>
              {service_type.name}
            </td>
            <td>
              {service_type.city_hall}
            </td>
            <td>
              <a className='back-bt waves-effect btn-flat' 
                 href='#' 
                 onClick={ () => 
                 browserHistory.push(`/service_types/${service_type.id}/edit`) 
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
        <th>Descrição</th>
        <th>Situação</th>
        <th>Setor</th>
        <th>Prefeitura</th>
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

	newServiceTypeButton() {
		return (
			<button 
        onClick={() =>
          browserHistory.push({ pathname: `/service_types/new`}) 
        }
        className="btn waves-effect btn button-color" 
        name="anterior" 
        type="submit">
          NOVO TIPO DE ATENDIMENTO
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

const ServiceTypeList = connect(
  mapStateToProps
)(getServiceTypeList)
export default ServiceTypeList
