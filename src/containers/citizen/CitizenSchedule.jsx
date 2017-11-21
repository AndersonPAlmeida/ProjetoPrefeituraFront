import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, NavItem, Navbar } from 'react-materialize'
import styles from './styles/CitizenSchedule.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';

class getCitizenSchedule extends Component {
  constructor(props) {
      super(props)
      this.state = {
          collections: [],
          schedules: [],
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
          last_fetch_situation: 0
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
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
        sectors: resp.sectors
      })
    });
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
            <h2 className='card-title h2-title-home'>Bem vindo Administrador MPOG! </h2>
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
		return (
			<div>
				<div className='card'>
          <div className='card-content'>
            <h2 className='card-title h2-title-home'>Situação de agendamentos </h2>
            <div className={styles['div-component-home']}>
            	<p>Agendamentos por setor: utilizados/máximo</p>
            	<p>Setor de Agendamento MPOG: 0/10  </p>
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

  handleInputFilterChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    })
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
      <div className='select-field'>
        <Input s={12} l={4} m={12} name="filter_sector" type='select' value={this.state.filter_sector}
          onChange={
            (event) => {
              var selected_sector = event.target.value
              if(this.state.filter_sector != selected_sector) {
                var service_types
                if(selected_sector != 0) {
                  service_types = this.state.collection.service_type.filter(
                    function(type) {
                      return type.sector_id == selected_sector
                    }
                  ) 
                }
                else {
                  service_types = this.state.collection.service_type
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
          {sectorsList}
        </Input>
      </div>
    )
  }

  filterSchedule() {
    return (
      <div>
        <Row className='filter-container'>
          <Col>
            <div>
              {this.pickSector()}
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
      'filter_sector': 0,
      'filter_service_type': 0,
      'filter_service_place': 0,
      'filter_situation': 0
    })
  }

  handleFilterSubmit(sort_only) {
    var sector
    var service_type
    var service_place
    var situation
    if(sort_only) {
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
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `schedules`;
    const params = `permission=${this.props.user.current_role}
                    &q[sector_id]=${sector}
                    &q[service_type_id]=${service_type}
                    &q[s]=${this.state.filter_s}
                    &q[service_place_id]=${service_place}
                    &q[situation_id]=${situation}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      this.setState({
        schedules: resp,
        last_fetch_sector: sector,
        last_fetch_service_type: service_type,
        last_fetch_service_place: service_place,
        last_fetch_situation: situation
      })
    });
  }

	fourthComponent() {
		return (
			<div>
				<div className='card'>
          <div className='card-content'>
            <h2 className='card-title h2-title-home'>Buscar agendamentos </h2>
            {this.filterSchedule()}
          </div>
		    </div>
			</div>
		)
	}

  render() {
    return (
      <div> 
	      <main>
	      	<Row>
		        <Col s={12}>
			      	<div>
			      		{this.firstComponent()}
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

