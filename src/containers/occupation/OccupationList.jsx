import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input, Pagination} from 'react-materialize'
import styles from './styles/OccupationList.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';

class getOccupationList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          occupations: [],
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
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    var collection = `occupations`;
    const params = `permission=${this.props.user.current_role}`

    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({
                  occupations: resp.entries,
                  num_entries: resp.num_entries
                })

    });
    if(this.props.current_role && this.props.current_role.role == 'adm_c3sl') {
     collection = 'forms/occupation_index';
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
      <div className='card card-occupation' >
        <div className='card-content'>
          <h2 className='card-title h2-title-home'>Cargos</h2>
          {this.filterOccupation()}
          {this.tableList()}
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
      this.state.occupations.map((occupation) => {
        return (
          <tr>
            <td>
              <a className='back-bt waves-effect btn-flat'
                href='#'
                onClick={ () =>
                  browserHistory.push(`/occupations/${occupation.id}`)
                }>
                {occupation.name}
              </a>
            </td>
            <td className='description-column' >
              {occupation.description}
            </td>
            <td>
              {occupation.active ? 'Ativo' : 'Inativo'}
            </td>
            {
           this.props.user && this.props.user.roles && this.props.user.roles[this.props.user.current_role_idx] &&
           this.props.user.roles[this.props.user.current_role_idx].role == 'adm_c3sl' ?
             <td>
               {occupation.city_hall_name}
             </td>
             :
             null
           }

            <td>
              <a className='back-bt waves-effect btn-flat'
                 href='#'
                 onClick={ () =>
                 browserHistory.push(`/occupations/${occupation.id}/edit`)
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
        {
         this.props.user && this.props.user.roles && this.props.user.roles[this.props.user.current_role_idx] &&
         this.props.user.roles[this.props.user.current_role_idx].role == 'adm_c3sl' ?
           <th>{this.sortableColumn.bind(this)('Prefeitura','city_hall_name')}</th> :
           null
       }

        <th>Editar</th>
      </tr>
    )

    var num_items_per_page = 25
    var num_pages = Math.ceil(this.state.num_entries/num_items_per_page)
    return (
      <div>
        <p className={styles['description-column']}>
          Mostrando{
             num_pages != 0
             ?
             this.state.current_page == num_pages
             ?
             this.state.num_entries % num_items_per_page == 0
             ?
             ` ${num_items_per_page} `
             :
             ` ${this.state.num_entries % num_items_per_page} `
             :
             ` ${num_items_per_page} `
             :
             ' 0 '
           }
          de {
            ` ${this.state.num_entries} `

          }
           registros
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

  filterOccupation() {
    return (
      <div>
      <Row className="row-occupation">
        {
          this.props.user.roles[this.props.user.current_role_idx].role == 'adm_c3sl' ?
            this.pickCityHall() :
            null
        }
          <Col s={12} m={4}  >
            <div>
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
          <Col s={12} m={4}>
            <div>
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
        </Row>

          <Row>
            <Col>
              <button className="waves-effect btn button-green search-button" onClick={this.handleFilterSubmit.bind(this,false)} name="commit" type="submit">BUSCAR </button>
            </Col>
            <Col>
              <button className="waves-effect btn button-white clean-button" onClick={this.cleanFilter.bind(this)} name="commit">LIMPAR CAMPOS  </button>
            </Col>
            <Col>
              {this.newOccupationButton()}
            </Col>
          </Row>
      </div>
    )
  }

  cleanFilter() {
    this.setState({
      'filter_description': '',
      'filter_name': '',
    })
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `occupations`;
    const params = `permission=${this.props.user.current_role}`

    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ occupations: resp.entries })
    });
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

    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `occupations`;
    const params = `permission=${this.props.user.current_role}`
                    +`&q[name]=${name}`
                    +`&q[description]=${description}`
                    +`&q[description]=${description}`
                    +`&q[city_hall_id]=${city_hall}`
                    +`&q[s]=${this.state.filter_s}`
                    +`&page=${this.state.current_page}`;
    current_page = sort_only ? this.state.current_page : 1;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      this.setState({
        occupations: resp.entries,
        num_entries: resp.num_entries,
        last_fetch_name: name,
        last_fetch_description: description,
        last_fetch_city_hall: city_hall,
        current_page: current_page
      })
    });
  }
	newOccupationButton() {
		return (
			<button
        onClick={() =>

          browserHistory.push({ pathname: `/occupations/new`})
        }
        className="waves-effect btn button-green new-occupation-button"
        name="new occupation"
        type="submit">
          INSERIR NOVO CARGO
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

const OccupationList = connect(
  mapStateToProps
)(getOccupationList)
export default OccupationList
