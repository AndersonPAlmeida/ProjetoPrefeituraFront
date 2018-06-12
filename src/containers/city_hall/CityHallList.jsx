import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input, Pagination } from 'react-materialize'
import styles from './styles/CityHallList.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';
import MaskedInput from 'react-maskedinput';

const role_name = {
  'citizen': "Cidadão",
  'responsavel_atendimento': "Responsável Atendimento",
  'atendente_local': "Atendente Local",
  'adm_local': "Administrador Local",
  'adm_prefeitura': "Administrador Prefeitura",
  'adm_c3sl': "Administrador C3SL"
}

//TODO: aplicar mascara para CEP na tabela, validar a troca de paginas, a ordenação, o editar.

class getCityHallList extends Component {
  constructor(props) {
      super(props)
      this.state = {
        city_halls: [],
        filter_name: '',
        filter_state: '',
        filter_city: '',
        last_fetch_name: '',
        last_fetch_state: '',
        last_fetch_city: '',
        filter_s: '',
        num_entries: 0,
        current_page: 1,
      };

      this.handleInputFilterChange = this.handleInputFilterChange.bind(this);
  }

  addZeroBefore(n) {
    return (n < 10 ? '0' : '') + n;
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    var collection = `city_halls`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {

        self.setState({
          city_halls: resp.entries,
          num_entries: resp.num_entries
        });

    });

  }

  render() {
    return (
      <main>
        <Row>
          <Col s={12}>
            <div className='card'>
              <div className='card-content'>
                <h2 className='card-title h2-title-home'> Prefeitura </h2>
                <Row>
                  {this.filterCityHall()}
                  {this.state.city_halls.length > 0 ? this.tableList() : '- Nenhuma prefeitura encontrada'}
                </Row>

              </div>
              <div className="card-action">
                {this.newCityHallButton()}
              </div>
            </div>
          </Col>
        </Row>
      </main>
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
      this.state.city_halls.map((city_hall) => {
        return (
          <tr key={city_hall.id}>
            <td>
              {city_hall.name}
            </td>
            <td className='description-column' >
              {city_hall.cep}
            </td>
            <td>
              {city_hall.active ? 'Ativo' : 'Inativo'}
            </td>

            <td>
              <a className='back-bt waves-effect btn-flat'
                 href='#'
                 onClick={ () =>
                 browserHistory.push(`/city_hall/${city_hall.id}/edit`)
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
        <th>{this.sortableColumn.bind(this)('Situação','active')}</th>
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

    if(target.validity.valid) {
      this.setState({
        [name]: value
      })
    }
  }



  cleanFilter() {
    this.setState({
      'filter_state': '',
      'filter_name': '',
      'filter_city': ''
    })
  }

  filterCityHall() {
    return (
      <div>
        <Row></Row>
        <Row s={12}>
          <Col s={12} m={3}>
            <div>
              <h6>Nome:</h6>
              <label>
                <input
                  type="text"
                  name="filter_name"
                  value={this.state.filter_name} onChange={this.handleInputFilterChange}
                />
              </label>
            </div>
          </Col>
          <Col s={12} m={3}>
            <div>
              <h6>Estado:</h6>
              <label>
                <input
                  type="text"
                  name="filter_state"
                  value={this.state.filter_state}
                  onChange={this.handleInputFilterChange}
                />
              </label>
            </div>
          </Col>
          <Col s={12} m={3}>
            <div>
              <h6>Município:</h6>
              <label>
                <input
                  type="text"
                  name="filter_city"
                  value={this.state.filter_city}
                  onChange={this.handleInputFilterChange}
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
          <Col>
            {this.newCityHallButton()}
          </Col>
        </Row>
      </div>
    )
  }


  handleFilterSubmit(sort_only) {
    //TODO:
  }


  newCityHallButton(){
    return(
      <button
        onClick={() =>
          browserHistory.push({ pathname: '/city_hall/new'})
        }
        className="btn waves-effect btn button-color"
        name="anterior"
        type="submit">
          CADASTRAR NOVA PREFEITURA
      </button>
    );
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

const CityHallList = connect(
  mapStateToProps
)(getCityHallList)
export default CityHallList
