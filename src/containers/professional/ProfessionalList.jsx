import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input, Pagination } from 'react-materialize'
import styles from './styles/ProfessionalList.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';

const role_name = {
  'citizen': "Cidadão",
  'responsavel_atendimento': "Responsável Atendimento",
  'atendente_local': "Atendente Local",
  'adm_local': "Administrador Local",
  'adm_prefeitura': "Administrador Prefeitura",
  'adm_c3sl': "Administrador C3SL"
}

class getProfessionalList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          collections: {
            permissions: [],
            occupations: [],
            service_places: []
          },
          professionals: [],
          filter_name: '',
          filter_registration: '',
          filter_cpf: '',
          filter_permission: '',
          filter_occupation: '',
          filter_service_place: '',
          filter_situation: '',
          last_fetch_name: '',
          last_fetch_registration: '',
          last_fetch_cpf: '',
          last_fetch_permission: '',
          last_fetch_occupation: '',
          last_fetch_service_place: '',
          last_fetch_situation: '',
          filter_s: '',
          num_entries: 0,
          current_page: 1
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    var collection = `forms/create_professional`
    const params = `permission=${this.props.user.current_role}`
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
    collection = `professionals`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ 
                      professionals: resp.entries,
                      num_entries: resp.num_entries
                    })
    });
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Profissional </h2>
          {this.filterProfessional()}
          {this.tableList()}
        </div>
        <div className="card-action">
          {this.newProfessionalButton()}
        </div>
      </div>
      )
  }
  
  formatCPF(n) {
    n = n.replace(/\D/g,"");
    n = n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})$/,"$1.$2.$3-$4");
    return (n);
  }

  printRoles(roles) {
    var str = ""
    for (let i = 0; i < roles.length-1; i++) {
      str += `${role_name[roles[i]]}, `
    }
    str += `${role_name[roles[roles.length-1]]}`
    return str
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
            <div />
        }
        {
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
      this.state.professionals.map((professional) => {
        return (
          <tr>
            <td>
              <a className='back-bt waves-effect btn-flat' 
                href='#' 
                onClick={ () => 
                  browserHistory.push(`/professionals/${professional.id}`) 
                }>
                {professional.name}
              </a>
            </td>
            <td>
              {professional.registration}
            </td>
            <td>
              {this.printRoles(professional.roles_names)}
            </td>
            <td>
              {professional.occupation_name}
            </td>
            <td>
              {this.formatCPF(professional.cpf)}
            </td>
            <td>
              {professional.phone}
            </td>
            <td>
              {professional.email}
            </td>
            <td>
              {professional.active ? 'Ativo' : 'Inativo'}
            </td>
            <td>
              <a className='back-bt waves-effect btn-flat' 
                 href='#' 
                 onClick={ () => 
                 browserHistory.push(`/professionals/${professional.id}/edit`) 
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
        <th>{this.sortableColumn.bind(this)('Matrícula','registration')}</th>
        <th>Permissão</th>
        <th>{this.sortableColumn.bind(this)('Cargo','occupation')}</th>
        <th>{this.sortableColumn.bind(this)('CPF','citizen_cpf')}</th>
        <th>Telefone</th>
        <th>{this.sortableColumn.bind(this)('E-mail','email')}</th>
        <th>{this.sortableColumn.bind(this)('Situação','active')}</th>
        <th>Situação</th>
        <th></th>
      </tr>
    )

    var num_pages = Math.ceil(this.state.num_entries/25)

    return (
      <div>
        <p className={styles['description-column']}>
          Mostrando
          {
            num_pages != 0 
              ? 
                this.state.current_page == num_pages
                  ?
                    this.state.num_entries % 25 == 0 ? ' 25 ' : ` ${this.state.num_entries % 25} `
                  :
                    ' 25 '
              :
                ' 0 '
              
          }
          de {this.state.num_entries} registros
        </p>
        <br />
        <table className={styles['table-list']}>
          <thead>
            {fields}
          </thead>
          <tbody>
            {data}
          </tbody>
        </table>
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
          items={Math.ceil(this.state.num_entries/25)}
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
  
  pickName() {
    return (
      <Row className='filter-container'>
        <Col>
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
      </Row>
    )
  }

  pickRegistration() {
    return (
      <Row className='filter-container'>
        <Col>
          <div>
            <h6>Matrícula:</h6>
            <label>
              <input
                type="text"
                className='input-field'
                name="filter_registration"
                value={this.state.filter_registration}
                onChange={this.handleInputFilterChange.bind(this)}
              />
            </label>
          </div>
        </Col>
      </Row>
    )
  }


  pickCPF () {
    return (
      <Row className='filter-container'>
        <Col>
          <div className="" >
            <h6>CPF:</h6>
            <label>
              <input
                type="text"
                className='input-field'
                name="filter_cpf"
                value={this.state.filter_cpf}
                onChange={this.handleInputFilterChange.bind(this)}
              />
            </label>
          </div>
        </Col>
      </Row>
    )
  }

  pickPermission() {
    const permissionList = (
      this.state.collections.permissions.map((permission) => {
        return (
          <option value={permission.role}>{permission.name}</option>
        )
      })
    )
    return (
      <Col>
        <div className='select-field'>
          <h6>Permissão:</h6>
          <Input s={12} m={12} name="filter_permission" type='select' value={this.state.filter_permission}
            onChange={
              (event) => {
                var selected_permission = event.target.value
                if(this.state.filter_permission != selected_permission) {
                  this.setState({
                    filter_permission: selected_permission,
                  });
                }
              }
            }
          >
            <option value={''}>Todas</option>
            {permissionList}
          </Input>
        </div>
      </Col>
    )
  }

  pickOccupation() {
    const occupationList = (
      this.state.collections.occupations.map((occupation) => {
        return (
          <option value={occupation.id}>{occupation.name}</option>
        )
      })
    )
    return (
      <Col>
        <div className='select-field'>
          <h6>Cargo:</h6>
          <Input s={12} m={12} name="filter_occupation" type='select' value={this.state.filter_occupation}
            onChange={
              (event) => {
                var selected_occupation = event.target.value
                if(this.state.filter_occupation != selected_occupation) {
                  this.setState({
                    filter_occupation: selected_occupation,
                  });
                }
              }
            }
          >
            <option value={''}>Todos</option>
            {occupationList}
          </Input>
        </div>
      </Col>
    )
  }

  pickServicePlace() {
    const servicePlaceList = (
      this.state.collections.service_places.map((service_place) => {
        return (
          <option value={service_place.id}>{service_place.name}</option>
        )
      })
    )
    return (
      <Col>
        <div className='select-field'>
          <h6>Local de Atendimento:</h6>
          <Input s={12} m={12} name="filter_service_place" type='select' value={this.state.filter_service_place}
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

  pickSituation() {
    return (
      <Col>
        <div className='select-field'>
          <h6>Situação:</h6>
          <Input s={12} m={12} name="filter_situation" type='select' value={this.state.filter_situation}
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
            <option value={''}>Todas</option>
            <option value={'true'}>Ativo</option>
            <option value={'false'}>Inativo</option>
          </Input>
        </div>
      </Col>
    )
  }

  filterProfessional() {
    return (
      <div>
        {this.pickPermission()}
        {this.pickOccupation()}
        {this.pickServicePlace()}
        {this.pickSituation()}
        {this.pickName()}
        {this.pickRegistration()}
        {this.pickCPF()}
        <Row>
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
      'filter_registration': '',
      'filter_cpf': '',
      'filter_permission': '',
      'filter_occupation': '',
      'filter_service_place': '',
      'filter_situation': ''
    })
  }

  handleFilterSubmit(sort_only) {
    var name
    var cpf
    var registration
    var permission
    var occupation
    var service_place
    var situation
    if(sort_only) {
      name = this.state.last_fetch_name
      cpf = this.state.last_fetch_cpf
      registration = this.state.last_fetch_registration
      permission = this.state.last_fetch_permission
      occupation = this.state.last_fetch_occupation
      service_place = this.state.last_fetch_service_place
      situation = this.state.last_fetch_situation
    } else {
      name = this.state.filter_name
      cpf = this.state.filter_cpf
      registration = this.state.filter_registration
      permission = this.state.filter_permission
      occupation = this.state.filter_occupation
      service_place = this.state.filter_service_place
      situation = this.state.filter_situation
    }
    name = name.replace(/\s/g,'+')
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `/professionals`;
    const params = `permission=${this.props.user.current_role}`
                    +`&q[name]=${name}`
                    +`&q[role]=${permission}`
                    +`&q[occupation]=${occupation}`
                    +`&q[service_place]=${service_place}`
                    +`&q[situation]=${situation}`
                    +`&q[occupation]=${occupation}`
                    +`&q[active]=${situation}`
                    +`&q[s]=${this.state.filter_s}`
                    +`&page=${this.state.current_page}`
    console.log(`${apiUrl}/${collection}?${params}`)
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      this.setState({
        professionals: resp.entries,
        num_entries: resp.num_entries,
        last_fetch_name: name,
        last_fetch_cpf: cpf,
        last_fetch_registration: registration,
        last_fetch_permission: permission,
        last_fetch_occupation: occupation,
        last_fetch_service_place: service_place,
        last_fetch_situation: situation,
        current_page: 1
      })
    });
  }

	newProfessionalButton() {
		return (
			<button 
        onClick={() =>
          browserHistory.push({ pathname: `/professionals/new`, query: {cep: this.props.user.citizen.cep}}) 
        }
        className="btn waves-effect btn button-color" 
        name="anterior" 
        type="submit">
          CADASTRAR NOVO PROFISSIONAL 
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

const ProfessionalList = connect(
  mapStateToProps
)(getProfessionalList)
export default ProfessionalList
