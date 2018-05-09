import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input, Collapsible, CollapsibleItem, Pagination } from 'react-materialize'
import styles from './styles/ProfessionalIndex.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import strftime from 'strftime'

const role_name = {
  'citizen': "Cidadão",
  'responsavel_atendimento': "Responsável Atendimento",
  'atendente_local': "Atendente Local",
  'adm_local': "Administrador Local",
  'adm_prefeitura': "Administrador Prefeitura",
  'adm_c3sl': "Administrador C3SL"
}
class getProfessionalIndex extends Component {
  constructor(props) {
      super(props)
      this.state = {
          service_types: [],
          shifts: [],
          filter_service_type: '',
          last_fetch_service_type: '',
          filter_s: '',
          num_entries: 0,
          current_page: 1
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    var collection = `forms/shift_index`
    var params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({
                      service_types: resp.service_types
                    })
    });
    collection = `shifts`;
    //params += `q[professional]=${this.props.current_role.professional_id}`
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

	firstComponent() {
		return (
			<div>
				<div className='card'>
          <div className='card-content'>
            <h2 className='card-title h2-title-home'>Bem vindo {this.props.user.citizen.name}! </h2>
            <div className='div-component-home'>
              { this.props.current_role ?
                <p>Você está acessando o Sistema Agendador como <b>{role_name[this.props.current_role.role]}</b>, no local <b>{this.props.current_role.service_place}</b>, situado em <b>{this.props.current_role.city_hall_name}</b>.
                 Para mais informações sobre como usar o Sistema Agendador de Serviços Públicos 
                visite o Manual de Utilização ou a seção de Perguntas Frequentes.</p>
                : null
              }
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
            <h2 className='card-title h2-title-home'>Escalas de {this.props.user.citizen.name}! </h2>
            <div className='div-component-home'>
              {this.filterShift()}
              {this.state.shifts.length > 0 ? this.tableList() : '- Nenhuma escala encontrada'}
            </div>
          </div>
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

  addZeroBefore(n) {
    return (n < 10 ? '0' : '') + n;
  }

  tableList() {
    var date
    var d
    var time
    const data = (
      this.state.shifts.map((shift) => {
        date = strftime.timezone('+0000')('%d/%m/%Y', new Date(shift.execution_start_time))
        d = new Date(shift.execution_start_time)
        time = this.addZeroBefore(d.getHours()) + ":" + this.addZeroBefore(d.getMinutes())
        return (
          <tr>
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

  pickServiceType() {
    const service_typeList = (
      this.state.service_types.map((service_type) => {
        return (
          <option value={service_type.id}>{service_type.description}</option>
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

  filterShift() {
    return (
      <div>
        <Row></Row>
        <Row s={12}>
          {this.pickServiceType()}
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
      'filter_service_type': '',
    })
  }

  handleFilterSubmit(sort_only) {
    var service_type
    var current_page
    if(sort_only) {
      service_type = this.state.last_fetch_service_type
    } else {
      service_type = this.state.filter_service_type
    }
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `/shifts`;
    const params = `permission=${this.props.user.current_role}`
                    //+`&q[professional]=${this.props.current_role.professional_id}`
                    +`&q[service_type_id]=${service_type}`
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
        last_fetch_service_type: service_type,
        current_page: current_page
      })
    });
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
  const current_role = user.roles[user.current_role_idx]
  return {
    user,
    current_role
  }
}

const ProfessionalIndex = connect(
  mapStateToProps
)(getProfessionalIndex)
export default ProfessionalIndex

