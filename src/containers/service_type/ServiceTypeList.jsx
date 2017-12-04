import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ServiceTypeList.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';

class getServiceTypeList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          service_types: [],
          filter_description: '',
          filter_situation: '',
          last_fetch_description: '',
          last_fetch_situation: '',
          filter_q: ''   
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `service_types`;
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
          <h2 className='card-title h2-title-home'> Tipo de Atendimento </h2>
          {this.filterServiceType()}
          {this.tableList()}
        </div>
        <div className="card-action">
          {this.newServiceTypeButton()}
        </div>
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
              {service_type.active ? 'Ativo' : 'Inativo'}
            </td>
            <td>
              {service_type.sector_name}
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
        <th>
          <a
            href='#'
            onClick={
              () => {
                this.setState({
                  ['filter_s']: this.state.filter_s == "description+asc" ? 'description+desc' : "description+asc"
                }, this.handleFilterSubmit.bind(this,true))
              }
            }
          >
            Descrição 
            {
              this.state.filter_s == "description+asc" ?
                <i className="waves-effect material-icons tiny tooltipped">
                  arrow_drop_down
                </i>
                :
                <div />
            }
            {
              this.state.filter_s == "description+desc" ?
                <i className="waves-effect material-icons tiny tooltipped">
                  arrow_drop_up
                </i>
                :
                <div />
            }
          </a>
        </th>
        <th>Situação</th>
        <th>Setor</th>
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

  filterServiceType() {
    return (
      <div>
        <Row className='filter-container'>
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
      'filter_situation': ''
    })
  }

  handleFilterSubmit(sort_only) {
    var description
    var situation
    if(sort_only) {
      description = this.state.last_fetch_description
      situation = this.state.last_fetch_situation
    } else {
      description = this.state.filter_description
      situation = this.state.filter_situation
    }
    description = description.replace(/\s/g,'+')
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `service_types`;
    const params = `permission=${this.props.user.current_role}&q[description]=${description}&q[s]=${this.state.filter_s}&q[active]=${situation}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      this.setState({
        service_types: resp,
        last_fetch_description: description,
        last_fetch_situation: situation
      })
    });
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
          CADASTRAR NOVO TIPO DE ATENDIMENTO
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
