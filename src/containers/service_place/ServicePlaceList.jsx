import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input, Pagination } from 'react-materialize'
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
          city_halls: [],
          filter_name: '',
          filter_situation: '',
          filter_neighborhood: '',
          filter_city_hall: '',
          last_fetch_name: '',
          last_fetch_situation: '',
          last_fetch_neighborhood: '',
          last_fetch_city_hall: '',
          filter_s: '',
          num_entries: 0,
          current_page: 1
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    var collection = `service_places`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ 
                      service_places: resp.entries,
                      num_entries: resp.num_entries
                    })
    });
    if(this.props.current_role && this.props.current_role.role == 'adm_c3sl') {
      collection = 'forms/service_place_index';
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get",
      }).then(parseResponse).then(resp => {
        self.setState({ city_halls: resp.city_halls })
      });
    }
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Local de Atendimento </h2>
          {this.filterServicePlace()}
          {this.state.service_places.length > 0 ? this.tableList() : '- Nenhum local de atendimento encontrado'}
        </div>
        <div className="card-action">
          {this.newServicePlaceButton()}
        </div>
      </div>
      )
  }

  sortableColumn(title, name) {
    return (
      <a
        href='#'
        onClick={
          () => {
            this.setState({
              ['filter_s']: this.state.filter_s == `${name}+asc` ? `${name}+desc` : `${name}+asc`
            }, this.handleFilterSubmit.bind(this,true))
          }
        }
      >
        {title}
        {
          this.state.filter_s == `${name}+asc` ?
            <i className="waves-effect material-icons tiny tooltipped">
              arrow_drop_down
            </i>
            :
            this.state.filter_s == `${name}+desc` ?
              <i className="waves-effect material-icons tiny tooltipped">
                arrow_drop_up
              </i>
              :
              <div />
        }
      </a>
    )
  }
  
	tableList() {
    const data = (
      this.state.service_places.map((service_place) => {
        return (
          <tr>
            <td>
              {service_place.name}
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
            {
              this.props.user && this.props.user.roles && this.props.user.roles[this.props.user.current_role_idx] &&
              this.props.user.roles[this.props.user.current_role_idx].role == 'adm_c3sl' ?
                <td>
                  {service_place.city_hall_name}
                </td>
                :
                null
            }
            <td>
              <a className='back-bt waves-effect btn-flat' 
                href='#' 
                onClick={ () => 
                  browserHistory.push(`/service_places/${service_place.id}`) 
                }>
                  <i className="waves-effect material-icons tooltipped">
                    visibility
                  </i>
              </a> 
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
        <th>{this.sortableColumn.bind(this)('Nome','name')}</th>
        <th>{this.sortableColumn.bind(this)('CEP','cep')}</th>
        <th>{this.sortableColumn.bind(this)('Bairro','neighborhood')}</th>
        <th>Estado</th>
        <th>Munícipo</th>
        <th>Telefone</th>
        <th>{this.sortableColumn.bind(this)('Situação','active')}</th>
        {
          this.props.user && this.props.user.roles && this.props.user.roles[this.props.user.current_role_idx] &&
          this.props.user.roles[this.props.user.current_role_idx].role == 'adm_c3sl' ?
            <th>{this.sortableColumn.bind(this)('Prefeitura','city_hall_name')}</th> :
            null
        }
        <th></th>
        <th></th>
      </tr>
    )
    var num_items_per_page = 25
    var num_pages = Math.ceil(this.state.num_entries/num_items_per_page)
    return (
      <div>
        <p>
          Mostrando
          {
            num_pages != 0
              ?
                this.state.current_page == num_pages
                  ?
                    this.state.num_entries % num_items_per_page == 0 ? ` ${num_items_per_page} ` : ` ${this.state.num_entries % num_items_per_page} `
                  :
                    ` ${num_items_per_page} `
              :
                ' 0 '
          }
          de {this.state.num_entries} registros
        </p>
        <br />
        <div className='div-table'>
          <table className={styles['table-list']}>
            <thead>
              {fields}
            </thead>
            <tbody>
              {data}
            </tbody>
          </table>
        </div>
        <br />
        <Pagination
          value={this.state.current_page}
          onSelect={ (val) =>
            {
              this.setState(
                {
                  current_page: val
                },
                () => {this.handleFilterSubmit.bind(this)(true)}
              )
            }
          }
          className={styles['pagination']}
          items={Math.ceil(this.state.num_entries/num_items_per_page)}
          activePage={this.state.current_page}
          maxButtons={8}
        />
      </div>
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

  pickCityHall() {
    const cityHallList = (
      this.state.city_halls.map((city_hall) => {
        return (
          <option value={city_hall.id}>{city_hall.name}</option>
        )
      })
    )
    return (
      <Col s={12} m={3}>
        <h6>Prefeitura:</h6>
        <Input name="filter_city_hall" type='select' value={this.state.filter_city_hall}
          onChange={
            (event) => {
              var selected_city_hall = event.target.value
              if(this.state.filter_city_hall != selected_city_hall) {
                this.setState({
                  filter_city_hall: selected_city_hall,
                });
              }
            }
          }
        >
          <option value={''}>Todas</option>
          {cityHallList}
        </Input>
      </Col>
    )
  }

  filterServicePlace() {
    return (
      <div>
        <Row s={12}></Row>
        <Row s={12}>
          {
            this.props.user && this.props.user.roles && this.props.user.roles[this.props.user.current_role_idx] &&
            this.props.user.roles[this.props.user.current_role_idx].role == 'adm_c3sl' ?
              this.pickCityHall() :
              null
          }
          <Col s={12} m={3}>
            <div>
              <h6>Nome:</h6>
              <label>
                <input
                  type="text"
                  name="filter_name"
                  value={this.state.filter_name}
                  onChange={this.handleInputFilterChange.bind(this)}
                />
              </label>
            </div>
          </Col>
          <Col s={12} m={3}>
            <div>
              <h6>Bairro:</h6>
              <label>
                <input
                  type="text"
                  name="filter_neighborhood"
                  value={this.state.filter_neighborhood}
                  onChange={this.handleInputFilterChange.bind(this)}
                />
              </label>
            </div>
          </Col>
          <Col s={12} m={3}>
            <div>
              <h6>Situação:</h6>
              <div>
                <Input
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
        </Row>
        <Row s={12}>
          <Col>
            <button className="waves-effect btn button-color" onClick={this.handleFilterSubmit.bind(this,false)} name="commit" type="submit">FILTRAR</button>
          </Col>
          <Col>
            <button className="waves-effect btn button-color" onClick={this.cleanFilter.bind(this)} name="commit" type="submit">LIMPAR CAMPOS</button>
          </Col>
        </Row>
      </div>
    )
  }

  cleanFilter() {
    this.setState({
      'filter_name': '',
      'filter_situation': '',
      'filter_neighborhood': '',
      'filter_city_hall': ''
    })
  }

  handleFilterSubmit(sort_only) {
    var name
    var situation
    var neighborhood
    var city_hall
    var current_page
    if(sort_only) {
      name = this.state.last_fetch_name
      situation = this.state.last_fetch_situation
      neighborhood = this.state.last_fetch_neighborhood
      city_hall = this.state.last_fetch_city_hall
    } else {
      name = this.state.filter_name
      situation = this.state.filter_situation
      neighborhood = this.state.filter_neighborhood
      city_hall = this.state.filter_city_hall
    }
    name = name.replace(/\s/g,'+')
    neighborhood = neighborhood.replace(/\s/g,'+')
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `service_places`;
    const params = `permission=${this.props.user.current_role}`
                  +`&q[name]=${name}`
                  +`&q[active]=${situation}`
                  +`&q[neighborhood]=${neighborhood}`
                  +`&q[city_hall_id]=${city_hall}`
                  +`&q[s]=${this.state.filter_s}`
    current_page = sort_only ? this.state.current_page : 1
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      this.setState({
        service_places: resp.entries,
        num_entries: resp.num_entries,
        last_fetch_name: name,
        last_fetch_situation: situation,
        last_fetch_neighborhood: neighborhood,
        last_fetch_city_hall: city_hall,
        current_page: current_page
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
            {this.mainComponent()}
          </Col>
        </Row>
      </main>
    )
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  const current_role = user.roles[user.current_role_idx]
  return {
    user,
    current_role
  }
}

const ServicePlaceList = connect(
  mapStateToProps
)(getServicePlaceList)
export default ServicePlaceList
