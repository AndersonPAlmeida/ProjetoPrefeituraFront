import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input, Pagination } from 'react-materialize'
import styles from './styles/ShiftList.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';
import MaskedInput from 'react-maskedinput';

class getShiftList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          collections: {
            professionals: [],
            service_types: [],
            service_places: [],
            city_halls: []
          },
          shifts: [],
          filter_professional: '',
          filter_service_type: '',
          filter_service_place: '',
          filter_city_hall: '',
          last_fetch_professional: '',
          last_fetch_service_type: '',
          last_fetch_service_place: '',
          last_fetch_city_hall: '',
          filter_s: '',
          num_entries: 0,
          current_page: 1
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    var collection = `forms/shift_index`
    const params = `permission=${this.props.user.current_role}`
    if(this.props.current_role.role !== 'responsavel_atendimento'){
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get",
        }).then(parseResponse).then(resp => {
          self.setState({
            collections: resp
          })
        });
    }
    collection = `shifts`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({
        shifts: resp.entries,
        num_entries: resp.num_entries
      })
    });
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Escala </h2>
          {
            this.props.current_role.role !== 'responsavel_atendimento'?
            this.filterShift() :
            <div/>
          }
          {this.state.shifts.length > 0 ? this.tableList() : '- Nenhuma escala encontrada'}
        </div>
        {
          this.props.current_role.role !== 'responsavel_atendimento'?
          <div className="card-action">
            {this.newShiftButton()}
          </div>
          :
          <div/>
        }
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

  addZeroBefore(n) {
    return (n < 10 ? '0' : '') + n;
  }

	tableList() {
    var date;
    var d;
    var time;
    const data = (
      this.state.shifts.map((shift) => {
        date = strftime.timezone('+0000')('%d/%m/%Y', new Date(shift.execution_start_time));
        d = new Date(shift.execution_start_time);
        time = this.addZeroBefore(d.getHours()) + ":" + this.addZeroBefore(d.getMinutes());
        return (
          <tr key={shift.id}>
            <td>
              {shift.professional_performer_name}
            </td>
            <td>
              {shift.service_type_description}
            </td>
            <td>
              {shift.service_place_name}
            </td>
            <td>
              {`${date} - ${time}`}
            </td>
            <td>
              <a className='back-bt waves-effect btn-flat'
                href='#'
                onClick={ () =>
                  browserHistory.push(`/shifts/${shift.id}`)
                }>
                <i className="waves-effect material-icons tooltipped">
                  visibility
                </i>
              </a>
            </td>
            {
             this.props.current_role.role !== 'responsavel_atendimento'?
                <td>
                  <a className='back-bt waves-effect btn-flat'
                     href='#'
                     onClick={(e) =>
                       {
                         e.preventDefault()
                         browserHistory.push({
                           pathname: `/shifts/${shift.id}/edit`
                         })
                       }
                     }>
                       <i className="waves-effect material-icons tooltipped">
                         edit
                       </i>
                  </a>
                </td>
                :
                <td/>

          }
          </tr>
        )
      })
    )

    // Fields to show in the table, and what object properties in the data they bind to
    const fields = (
      <tr>
        <th>Profissional</th>
        <th>{this.sortableColumn.bind(this)('Tipo de atendimento','service_type_description')}</th>
        <th>{this.sortableColumn.bind(this)('Local de atendimento','service_place_name')}</th>
        <th>{this.sortableColumn.bind(this)('Horário de início','execution_start_time')}</th>
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

    if(target.validity.valid) {
      this.setState({
        [name]: value
      })
    }
  }

  pickProfessional() {
    const professionalList = (
      this.state.collections.professionals.map((professional) => {
        return (
          <option key={professional.id} value={professional.id}>{professional.name}</option>
        )
      })
    )
    return (
      <Col s={12} m={3}>
        <div>
          <h6>Profissional:</h6>
          <Input name="filter_professional" type='select' value={this.state.filter_professional}
            onChange={
              (event) => {
                var selected_professional = event.target.value
                if(this.state.filter_professional != selected_professional) {
                  this.setState({
                    filter_professional: selected_professional,
                  });
                }
              }
            }
          >
            <option value={''}>Todas</option>
            {professionalList}
          </Input>
        </div>
      </Col>
    )
  }

  pickServiceType() {
    const service_typeList = (
      this.state.collections.service_types.map((service_type) => {
        return (
          <option key={service_type.id} value={service_type.id}>{service_type.description}</option>
        )
      })
    )
    return (
      <Col s={12} m={3}>
        <div>
          <h6>Tipo de Atendimento:</h6>
          <Input name="filter_service_type" type='select' value={this.state.filter_service_type}
            onChange={
              (event) => {
                var selected_service_type = event.target.value
                if(this.state.filter_service_type != selected_service_type) {
                  this.setState({
                    filter_service_type: selected_service_type,
                  });
                }
              }
            }
          >
            <option value={''}>Todos</option>
            {service_typeList}
          </Input>
        </div>
      </Col>
    )
  }

  pickServicePlace() {
    const servicePlaceList = (
      this.state.collections.service_places.map((service_place) => {
        return (
          <option key={service_place.id} value={service_place.id}>{service_place.name}</option>
        )
      })
    )
    return (
      <Col s={12} m={3}>
        <div>
          <h6>Local de Atendimento:</h6>
          <Input name="filter_service_place" type='select' value={this.state.filter_service_place}
            onChange={
              (event) => {
                var selected_service_place = event.target.value
                if(this.state.filter_service_place != selected_service_place) {
                  this.setState({
                    filter_service_place: selected_service_place,
                  });
                }
              }
            }
          >
            <option value={''}>Todos</option>
            {servicePlaceList}
          </Input>
        </div>
      </Col>
    )
  }

  pickCityHall() {
    const cityHallList = (
      this.state.collections.city_halls.map((city_hall) => {
        return (
          <option key={city_hall.id} value={city_hall.id}>{city_hall.name}</option>
        )
      })
    )
    return (
      <Col s={12} m={3}>
        <div>
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
        </div>
      </Col>
    )
  }

  filterShift() {
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
          {this.pickProfessional()}
          {this.pickServiceType()}
          {this.pickServicePlace()}
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
      'filter_professional': '',
      'filter_service_type': '',
      'filter_service_place': '',
      'filter_city_hall': ''
    })
  }

  handleFilterSubmit(sort_only) {
    var professional
    var service_type
    var service_place
    var city_hall
    var current_page
    if(sort_only) {
      professional = this.state.last_fetch_professional
      service_type = this.state.last_fetch_service_type
      service_place = this.state.last_fetch_service_place
      city_hall = this.state.last_fetch_city_hall
    } else {
      professional = this.state.filter_professional
      service_type = this.state.filter_service_type
      service_place = this.state.filter_service_place
      city_hall = this.state.filter_city_hall
    }
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `/shifts`;
    const params = `permission=${this.props.user.current_role}`
                    +`&q[professional]=${professional}`
                    +`&q[service_type_id]=${service_type}`
                    +`&q[service_place_id]=${service_place}`
                    +`&q[city_hall]=${city_hall}`
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
        shifts: resp.entries,
        num_entries: resp.num_entries,
        last_fetch_professional: professional,
        last_fetch_service_type: service_type,
        last_fetch_service_place: service_place,
        last_fetch_city_hall: city_hall,
        current_page: current_page
      })
    });
  }

	newShiftButton() {
		return (
			<button
        onClick={() =>
          browserHistory.push({pathname: `/shifts/new`})
        }
        className="btn waves-effect btn button-color"
        name="anterior"
        type="submit">
          CADASTRAR NOVA ESCALA
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

const ShiftList = connect(
  mapStateToProps
)(getShiftList)
export default ShiftList
