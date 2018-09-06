{/*
  * This file is part of Agendador.
  *
  * Agendador is free software: you can redistribute it and/or modify
  * it under the terms of the GNU General Public License as published by
  * the Free Software Foundation, either version 3 of the License, or
  * (at your option) any later version.
  *
  * Agendador is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  * GNU General Public License for more details.
  *
  * You should have received a copy of the GNU General Public License
  * along with Agendador.  If not, see <https://www.gnu.org/licenses/>.
  */}

import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input, Collapsible, CollapsibleItem, Pagination } from 'react-materialize'
import styles from './styles/CitizenSchedule.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import strftime from 'strftime'

class getCitizenSchedule extends Component {
  constructor(props) {
      super(props)
      this.state = {
          collections: [],
          schedules: { sectors: [], num_entries: 0 },
          dependants: [],
          sectors: [],
          situation: [],
          service_type: [],
          service_place: [],
          filter_sector: 0,
          filter_service_type: 0,
          filter_service_place: 0,
          filter_situation: 0,
          last_fetch_sector: 0,
          last_fetch_service_type: 0,
          last_fetch_service_place: 0,
          last_fetch_situation: 0,
          current_page: 1,
          current_dependant_id: '',
          current_dependant_page: 1,
      };
  }

  componentDidMount() {
    var self = this;
    // GET /forms/schedule_history
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    var collection = `forms/schedule_history`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({
        collections: resp,
        sectors: resp.sectors,
        situation: resp.situation
      })
    });
    // GET /schedules
    collection = `schedules`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({
        schedules: resp.schedules,
        dependants: resp.dependants
      })
    });
  }

    firstComponent() {
        return (
            <div>
                <div className='card'>
          <div className='card-content'>
            <h2 className='card-title h2-title-home'>Bem vindo {this.props.user.citizen.name}! </h2>
            <div className={styles['div-component-home']}>
                <p>Abaixo, você poderá visualizar o histórico, com seus agendamentos marcados,
                        efetuados e cancelados, podendo verificar também a possibilidade de realizar novos agendamentos.</p>
                <p>Para mais informações sobre como usar o Sistema Agendador de Serviços Públicos
                        visite o Manual de Utilização ou a seção de Perguntas Frequentes. </p>
            </div>
          </div>
            </div>
            </div>
        )
    }

    secondComponent() {
    const sectorsLimit = this.state.schedules && this.state.schedules.sectors.length > 0 ?
    (
      this.state.schedules.sectors.map((sector) => {
        return (
          <p>{sector.name}: {sector.schedules}/{sector.schedules_by_sector}</p>
        )
      })
    ) : <p>Nenhum agendamento realizado</p>
        return (
            <div>
                <div className='card'>
          <div className='card-content'>
            <h2 className='card-title h2-title-home'>Situação de agendamentos </h2>
            <div className={styles['div-component-home']}>
                <p><b>Agendamentos por setor: utilizados/máximo</b></p>
              {sectorsLimit}
            </div>
          </div>
            </div>
            </div>
        )
    }

    thirdComponent() {
        return (
            <div>
                <div className='card'>
          <div className='card-content'>
            <h2 className='card-title h2-title-home'>Histórico de agendamentos </h2>
            <div className={styles['div-component-home']}>
                <p>Agendamentos podem ser cancelados em até hora(s) antes do horário de início do atendimento.</p>
            </div>
          </div>
            </div>
            </div>
        )
    }

  pickSector() {
    const sectorsList = (
      this.state.sectors.map((sector) => {
        return (
          <option value={sector.id}>{sector.name}</option>
        )
      })
    )
    return (
      <Col s={12} m={3}>
        <div>
          <h6>Setor:</h6>
          <Input name="filter_sector" type='select' value={this.state.filter_sector}
            onChange={
              (event) => {
                var selected_sector = event.target.value
                if(this.state.filter_sector != selected_sector) {
                  var service_types
                  if(selected_sector != 0) {
                    service_types = this.state.collections.service_type.filter(
                      function(type) {
                        return type.sector_id == selected_sector
                      }
                    )
                  }
                  else {
                    service_types = this.state.collections.service_type
                  }
                  this.setState({
                    service_type: service_types,
                    filter_sector: selected_sector,
                    filter_service_type: 0,
                    filter_service_place: 0
                  });
                }
              }
            }
          >
            <option value={0}>Todos</option>
            {sectorsList}
          </Input>
        </div>
      </Col>
    )
  }


  pickServiceType() {
    const serviceTypeList = (
      this.state.service_type.map((type) => {
        return (
          <option value={type.id}>{type.description}</option>
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
                  var service_places
                  if(selected_service_type != 0) {
                    service_places = this.state.collections.service_place.filter(
                      function(service_place) {
                        for (let type of service_place.service_types) {
                          if(type == selected_service_type) {
                            return true
                          }
                        }
                        return false
                      }
                    )
                  }
                  else {
                    service_places = this.state.collections.service_place
                  }
                  this.setState({
                    service_place: service_places,
                    filter_service_type: selected_service_type,
                    filter_service_place: 0
                  });
                }
              }
            }
          >
            <option value={0}>Todos</option>
            {serviceTypeList}
          </Input>
        </div>
      </Col>
    )
  }

  pickServicePlace() {
    const servicePlaceList = (
      this.state.service_place.map((place) => {
        return (
          <option value={place.id}>{place.name}</option>
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
                if(this.state.filter_sector != selected_service_place) {
                  this.setState({
                    filter_service_place: selected_service_place,
                  });
                }
              }
            }
          >
            <option value={0}>Todos</option>
            {servicePlaceList}
          </Input>
        </div>
      </Col>
    )
  }

  pickSituation() {
    const situationList = (
      this.state.situation.map((situation) => {
        return (
          <option value={situation.id}>{situation.description}</option>
        )
      })
    )
    return (
      <Col s={12} m={3}>
        <div>
          <h6>Situação:</h6>
          <Input name="filter_situation" type='select' value={this.state.filter_situation}
            onChange={
              (event) => {
                var selected_situation = event.target.value
                if(this.state.filter_situation != selected_situation) {
                  this.setState({
                    filter_situation: selected_situation,
                  });
                }
              }
            }
          >
            <option value={0}>Todas</option>
            {situationList}
          </Input>
        </div>
      </Col>
    )
  }

  filterSchedule() {
    return (
      <div>
        <Row></Row>
        <Row>
            <Col s={12}>
                {this.pickSector()}
                {this.pickServiceType()}
                {this.pickServicePlace()}
                {this.pickSituation()}
            </Col>
        </Row>
        <Row >
            <Col s={12}>
              <Col>
                <button className="waves-effect btn button-color" onClick={this.handleFilterSubmit.bind(this,false)} name="commit" type="submit">FILTRAR</button>
              </Col>
              <Col>
              <button className="waves-effect btn button-color" onClick={this.cleanFilter.bind(this)} name="commit" type="submit">LIMPAR CAMPOS</button>
              </Col>
          </Col>
        </Row>
      </div>
    )
  }

  cleanFilter() {
    this.setState({
      'filter_sector': 0,
      'filter_service_type': 0,
      'filter_service_place': 0,
      'filter_situation': 0
    })
  }

  handleFilterSubmit(page_only) {
    var sector
    var service_type
    var service_place
    var situation
    var current_page
    if(page_only) {
      sector = this.state.last_fetch_sector
      service_type = this.state.last_fetch_service_type
      service_place = this.state.last_fetch_service_place
      situation = this.state.last_fetch_situation
    } else {
      sector = this.state.filter_sector
      service_type = this.state.filter_service_type
      service_place = this.state.filter_service_place
      situation = this.state.filter_situation
   }
    if(sector == 0)
      sector = ''
    if(service_type == 0)
      service_type = ''
    if(service_place == 0)
      service_place = ''
    if(situation == 0)
      situation = ''
    // GET /schedules with filter params
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `schedules`;
    const params = `permission=${this.props.user.current_role}`
                    +`&q[sector_id]=${sector}`
                    +`&q[service_type_id]=${service_type}`
                    +`&q[service_place_id]=${service_place}`
                    +`&q[situation_id]=${situation}`
                    +`&page=${this.state.current_page}`
                    +`&dependant_page=${this.state.current_dependant_page}`
                    +`&dependant_id=${this.state.current_dependant_id}`
    if(!page_only) {
      this.setState({
        current_dependant_page: 1,
        current_page: 1
      })
    }
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      this.setState({
        schedules: resp.schedules,
        dependants: resp.dependants,
        last_fetch_sector: sector,
        last_fetch_service_type: service_type,
        last_fetch_service_place: service_place,
        last_fetch_situation: situation,
      })
    });
  }

  addZeroBefore(n) {
    return (n < 10 ? '0' : '') + n;
  }

  tableList(schedules, num_entries, current_page, pagination_function) {
    var date
    var d
    var time

    const data = (
      schedules.map((schedule) => {
      date = strftime.timezone('+0000')('%d/%m/%Y', new Date(schedule.service_start_time))
      d = new Date(schedule.service_start_time)
      time = this.addZeroBefore(d.getHours()) + ":" + this.addZeroBefore(d.getMinutes())
        return (
          <tr  key={schedule.id}>
            <td>
              {schedule.id}
            </td>
            <td>
              {schedule.sector_name}
            </td>
            <td>
              {schedule.service_place_name}
            </td>
            <td>
              {schedule.service_type_name}
            </td>
            <td>
              {date}
            </td>
            <td>
              {time}
            </td>
            <td>
              {schedule.situation}
            </td>
            <td>
              {`Não disponível`}
            </td>
          </tr>
        )
      })
    )

    // Fields to show in the table, and what object properties in the data they bind to
    const fields = (
      <tr>
        <th>No.</th>
        <th>Setor</th>
        <th>Local de Atendimento</th>
        <th>Tipo de Atendimento</th>
        <th>Data</th>
        <th>Hora</th>
        <th>Situação</th>
        <th>Comprovante</th>
      </tr>
    )
    var num_items_per_page = 25
    var num_pages = Math.ceil(num_entries/num_items_per_page)
    return (
      <div>
        <p className={styles['description-column']}>
          Mostrando
          {
            num_pages != 0
              ?
                this.state.current_page == num_pages
                  ?
                    num_entries % num_items_per_page == 0 ? ` ${num_items_per_page} ` : ` ${num_entries % num_items_per_page} `
                  :
                    ` ${num_items_per_page} `
              :
                ' 0 '
          }
          de {num_entries} registros
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
          value={current_page}
          onSelect={pagination_function.bind(this)}
          className={styles['pagination']}
          items={Math.ceil(num_entries/num_items_per_page)}
          activePage={current_page}
          maxButtons={8}
        />
      </div>
    )
  }

  dependantSchedules() {
    var sectorsLimit;
    const dependantList = (
      this.state.dependants.map((dependant) => {
        sectorsLimit = (
          dependant.schedules.sectors.map((sector) => {
            return (
              <p>{sector.name}: {sector.schedules}/{sector.schedules_by_sector}</p>
            )
          })
        )
        return (
          <CollapsibleItem header={dependant.name}>
            {sectorsLimit}
            <br />
            {
              dependant.schedules.entries.length > 0 ?
                this.tableList(dependant.schedules.entries, dependant.schedules.num_entries,
                  (dependant.id == this.state.current_dependant_id) ? this.state.current_dependant_page : 1,
                  (val) =>
                    {
                      this.setState(
                        {
                          current_dependant_page: val,
                          current_dependant_id: dependant.id
                        },
                        () => {this.handleFilterSubmit.bind(this)(true)}
                      )
                    }
                )
                : '- Nenhum agendamento encontrado'
            }
          </CollapsibleItem>
        )
      })
    )
    return (
      <div>
        <br /><br />
        <b>Dependentes:</b>
        <Collapsible accordion>
          {dependantList}
        </Collapsible>
      </div>
    )
  }

    fourthComponent() {
        return (
            <div>
                <div className='card'>
          <div className='card-content'>
            <h2 className='card-title h2-title-home'>Buscar agendamentos </h2>
            {this.filterSchedule()}
            {
              (this.state.schedules && this.state.schedules.entries && this.state.schedules.entries.length) > 0 ?
                this.tableList(this.state.schedules.entries, this.state.schedules.num_entries, this.state.current_page,
                  (val) =>
                    {
                      this.setState(
                        {
                          current_page: val
                        },
                        () => {this.handleFilterSubmit.bind(this)(true)}
                      )
                    }
                )
                : '- Nenhum agendamento encontrado'
            }
            {this.dependantSchedules()}
          </div>
            </div>
            </div>
        )
    }

  render() {
    var home = false
    if(typeof location !== 'undefined' && location.search) {
        var search = location.search.substring(1);
        var query = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
        home = query
    }
    return (
      <div>
          <main>
              <Row>
                <Col s={12}>
                      <div>
                          {home ? this.firstComponent() : <div />}
                          {this.secondComponent()}
                          {this.thirdComponent()}
                          {this.fourthComponent()}
                      </div>
                  </Col>
            </Row>
          </main>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  return {
    user
  }
}

const CitizenSchedule = connect(
  mapStateToProps
)(getCitizenSchedule)
export default CitizenSchedule
