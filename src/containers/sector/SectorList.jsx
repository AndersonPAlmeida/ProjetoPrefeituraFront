import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input, Pagination } from 'react-materialize'
import styles from './styles/SectorList.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';

class getSectorList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          sectors: [],
          city_halls: [],
          filter_name: '',
          filter_description: '',
          filter_city_hall: '',
          last_fetch_name: '',
          last_fetch_description: '',
          last_fetch_city_hall: '',
          filter_s: '',
          num_entries: 0,
          current_page: 1
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    var collection = `sectors`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ 
                      sectors: resp.entries,
                      num_entries: resp.num_entries
                    })
    });
    if(this.props.current_role && this.props.current_role.role == 'adm_c3sl') {
      collection = 'forms/service_type_index';
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
          <h2 className='card-title h2-title-home'> Setor </h2>
          {this.filterSector()}
          {this.state.sectors.length > 0 ? this.tableList() : '- Nenhum setor encontrado'}
        </div>
        <div className="card-action">
          {this.newSectorButton()}
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
      this.state.sectors.map((sector) => {
        return (
          <tr>
            <td>
              {sector.name}
            </td>
            <td className='description-column' >
              {sector.description}
            </td>
            <td>
              {sector.active ? 'Ativo' : 'Inativo'}
            </td>
            <td>
              {sector.schedules_by_sector}
            </td>
            {
              this.props.user && this.props.user.roles && this.props.user.roles[this.props.user.current_role_idx] &&
              this.props.user.roles[this.props.user.current_role_idx].role == 'adm_c3sl' ?
                <td>
                  {sector.city_hall_name}
                </td>
                :
                null
            }

            <td>
              <a className='back-bt waves-effect btn-flat' 
                href='#' 
                onClick={ () => 
                  browserHistory.push(`/sectors/${sector.id}`) 
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
                 browserHistory.push(`/sectors/${sector.id}/edit`) 
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
        <th>{this.sortableColumn.bind(this)('Descrição','description')}</th>
        <th>{this.sortableColumn.bind(this)('Situação','situation')}</th>
        <th>{this.sortableColumn.bind(this)('Agendamentos por setor','schedules_by_sector')}</th>
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
        <p className={styles['description-column']}>
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

  filterSector() {
    return (
      <div>
        <Row></Row>
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
              <h6>Descrição:</h6>
              <label>
                <input
                  type="text"
                  name="filter_description"
                  value={this.state.filter_description}
                  onChange={this.handleInputFilterChange.bind(this)}
                />
              </label>
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
      'filter_description': '',
      'filter_name': '',
      'filter_city_hall': ''
    })
  }

  handleFilterSubmit(sort_only) {
    var name
    var description
    var city_hall
    var current_page
    if(sort_only) {
      name = this.state.last_fetch_name
      description = this.state.last_fetch_description
      city_hall = this.state.last_fetch_city_hall
    } else {
      name = this.state.filter_name
      description = this.state.filter_description
      city_hall = this.state.filter_city_hall
    }
    name = name.replace(/\s/g,'+')
    description = description.replace(/\s/g,'+')
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `sectors`;
    const params = `permission=${this.props.user.current_role}`
                    +`&q[name]=${name}`
                    +`&q[description]=${description}`
                    +`&q[city_hall_id]=${city_hall}`
                    +`&q[s]=${this.state.filter_s}`
                    +`&page=${this.state.current_page}`
    current_page = sort_only ? this.state.current_page : 1
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      this.setState({
        sectors: resp.entries,
        num_entries: resp.num_entries,
        last_fetch_name: name,
        last_fetch_description: description,
        last_fetch_city_hall: city_hall,
        current_page: current_page
      })
    });
  }

	newSectorButton() {
		return (
			<button 
        onClick={() =>
          browserHistory.push({ pathname: `/sectors/new`}) 
        }
        className="btn waves-effect btn button-color" 
        name="anterior" 
        type="submit">
          CADASTRAR NOVO SETOR
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

const SectorList = connect(
  mapStateToProps
)(getSectorList)
export default SectorList
