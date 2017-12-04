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
          service_places: [],
          filter_name: '',
          filter_description: '',
          filter_situation: '',
          filter_neighborhood: '',
          last_fetch_name: '',
          last_fetch_description: '',
          last_fetch_situation: '',
          last_fetch_neighborhood: '',
          filter_s: ''
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
          {this.filterServicePlace()}
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
        <th>
          <a
            href='#'
            onClick={
              () => {
                this.setState({
                  ['filter_s']: this.state.filter_s == "name+asc" ? 'name+desc' : "name+asc"
                }, this.handleFilterSubmit.bind(this,true))
              }
            }
          >
            Nome
            {
              this.state.filter_s == "name+asc" ?
                <i className="waves-effect material-icons tiny tooltipped">
                  arrow_drop_down
                </i>
                :
                <div />
            }
            {
              this.state.filter_s == "name+desc" ?
                <i className="waves-effect material-icons tiny tooltipped">
                  arrow_drop_up
                </i>
                :
                <div />
            }
          </a>
        </th>
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

  handleInputFilterChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
  }

  filterServicePlace() {
    return (
      <div>
        <Row className='filter-container'>
          <Col>
            <div className="field-input" >
              <h6>Nome:</h6>
              <label>
                <input
                  type="text"
                  className='input-field'
                  name="filter_name"
                  value={this.state.filter_name}
                  onChange={this.handleInputFilterChange.bind(this)}
                />
              </label>
            </div>
          </Col>
          <Col>
            <div className="field-input" >
              <h6>Descrição:</h6>
              <label>
                <input
                  type="text"
                  className='input-field'
                  name="filter_description"
                  value={this.state.filter_description}
                  onChange={this.handleInputFilterChange.bind(this)}
                />
              </label>
            </div>
          </Col>
          <Col>
            <div className="field-input" >
              <h6>Bairro:</h6>
              <label>
                <input
                  type="text"
                  className='input-field'
                  name="filter_neighborhood"
                  value={this.state.filter_neighborhood}
                  onChange={this.handleInputFilterChange.bind(this)}
                />
              </label>
            </div>
          </Col>
          <Col>
            <div className="field-input" >
              <h6>Situação:</h6>
              <div>
                <Input s={6} m={32} l={6}
                       type='select'
                       name='filter_situation'
                       value={this.state.filter_situation}
                       onChange={this.handleInputFilterChange.bind(this)}
                >
                  <option key={0} value={''}>Todos</option>
                  <option key={1} value={true}>Ativo</option>
                  <option key={2} value={false}>Inativo</option>
                </Input>
              </div>
            </div>
          </Col>
          <Row>
            <Col>
              <button className="waves-effect btn button-color" onClick={this.handleFilterSubmit.bind(this,false)} name="commit" type="submit">FILTRAR</button>
            </Col>
            <Col>
              <button className="waves-effect btn button-color" onClick={this.cleanFilter.bind(this)} name="commit" type="submit">LIMPAR CAMPOS</button>
            </Col>
          </Row>
        </Row>
      </div>
    )
  }

  cleanFilter() {
    this.setState({
      'filter_description': '',
      'filter_name': '',
      'filter_situation': '',
      'filter_neighborhood': ''
    })
  }

  handleFilterSubmit(sort_only) {
    var name
    var description
    var situation
    var neighborhood
    if(sort_only) {
      name = this.state.last_fetch_name
      description = this.state.last_fetch_description
      situation = this.state.last_fetch_situation
      neighborhood = this.state.last_fetch_neighborhood
    } else {
      name = this.state.filter_name
      description = this.state.filter_description
      situation = this.state.filter_situation
      neighborhood = this.state.filter_neighborhood
    }
    name = name.replace(/\s/g,'+')
    description = description.replace(/\s/g,'+')
    neighborhood = neighborhood.replace(/\s/g,'+')
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `service_places`;
    const params = `permission=${this.props.user.current_role}&q[name]=${name}&q[description]=${description}&q[s]=${this.state.filter_s}&q[active]=${situation}&q[neighborhood]=${neighborhood}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      this.setState({
        service_places: resp,
        last_fetch_name: name,
        last_fetch_description: description,
        last_fetch_situation: situation,
        last_fetch_neighborhood: neighborhood
      })
    });
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
