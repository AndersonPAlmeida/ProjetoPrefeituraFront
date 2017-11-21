import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, NavItem, Navbar } from 'react-materialize'
import styles from './styles/CitizenSchedule.css'

class CitizenSchedule extends Component {
  constructor(props) {
      super(props)
      this.state = {
          collections: [],
          schedules: [],
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
        schedules: resp
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
        <Input s={12} l={4} m={12} name="selected_sector" type='select' value={this.state.selected_sector}
          onChange={
            (event) => {
              if(event.target.value != this.state.selected_sector) {
                this.handleInputChange(event);
                this.setState({
                  service_type: this.state.service_type.find((type) => type.sector_id == event.target.value),
                  filter_service_type: '0',
                  filter_service_place: '0'
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

  filterServicePlace() {
    return (
      <div>
        <Row className='filter-container'>
          <Col>
            <div>
              {this.pickSector()}
              {this.pickServiceType()}
              {this.pickServicePlace()}
              {this.pickSituation()}
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
            <div className='card-content'>
              <h2 className='card-title h2-title-home'> Local de Atendimento </h2>
              {this.filterSchedule()}
              {this.tableList()}
            </div>
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

export default CitizenSchedule 
