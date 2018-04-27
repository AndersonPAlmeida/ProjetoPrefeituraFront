import React, {Component} from 'react'
import {Row, Col, Input, Pagination} from 'react-materialize'
import styles from './styles/ServiceList.css'
import 'react-day-picker/lib/style.css'
import {apiHost, apiPort, apiVer} from '../../../../config/env';
import {parseResponse} from "../../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../../redux-auth";
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import strftime from 'strftime';
import MaskedInput from 'react-maskedinput';
import ReportPDF from '../../reports/reportPDF'

class getServiceList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collections: {
        professionals: [],
        service_types: [],
        service_places: [],
        situation: [],
        city_halls: []
      },
      citizens: [],
      schedules: [],
      filter_name: '',
      filter_cpf: '',
      filter_professional: '',
      filter_situation: '',
      filter_service_place: '',
      filter_service_type: '',
      filter_city_hall: '',
      last_fetch_name: '',
      last_fetch_cpf: '',
      last_fetch_professional: '',
      last_fetch_situation: '',
      last_fetch_service_place: '',
      last_fetch_service_type: '',
      last_fetch_city_hall: '',
      filter_s: '',
      num_entries: 0,
      current_page: 1
    };
  }

  componentDidMount() {
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `forms/schedule_index`;
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "get"
    }).then(parseResponse).then(resp => {
      this.setState({collections: resp})
    });
    this.getSchedules(this.props.user.current_role);
  }

  mainComponent() {
    return (<div className='card'>
      <div className='card-content'>
        <h2 className='card-title h2-title-home'>Atendimentos
        </h2>
        {this.filterService()}
        {
          this.state.schedules.length > 0
            ? this.tableList()
            : '- Nenhum atendimento encontrado'
        }
      </div>
      <div className="card-action"></div>
    </div>)
  }

  getSchedules(role) {
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'schedules';
    const params = `not_available=true&permission=${role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'get'
    }).then(parseResponse).then(resp => {
      this.setState({
          schedules: resp.entries,
          num_entries: resp.num_entries
       });
    });
  }

  cleanFilter() {
    this.setState({
      'filter_city_hall': '',
      'filter_professional': '',
      'filter_service_type': '',
      'filter_service_place': '',
      'filter_situation': '',
      'filter_name': '',
      'filter_cpf': ''
    })
  }

  filterService() {
    return (<div>
      <Row></Row>
      <Row s={12}>
        {
          this.props.user && this.props.user.roles && this.props.user.roles[this.props.user.current_role_idx] && this.props.user.roles[this.props.user.current_role_idx].role == 'adm_c3sl'
            ? this.pickCityHall()
            : null
        }
        {this.pickName()}
        {this.pickCPF()}
        {this.pickProfessional()}
        {this.pickServiceType()}
        {this.pickServicePlace()}
        {this.pickSituation()}
      </Row>
      <Row s={12}>
        <Col>
          <button className="waves-effect btn button-color" onClick={this.handleFilterSubmit.bind(this,false)} name="commit" type="submit">FILTRAR</button>
        </Col>
        <Col>
          <button className="waves-effect btn button-color" onClick={this.cleanFilter.bind(this)} name="commit" type="submit">LIMPAR CAMPOS</button>
        </Col>
      </Row>
    </div>)
  }

  pickName() {
    return (<Col s={12} m={3}>
      <div>
        <h6>Nome:</h6>
        <label>
          <input type="text" name="filter_name" value={this.state.filter_name} onChange={this.handleInputFilterChange.bind(this)}/>
        </label>
      </div>
    </Col>)
  }

  pickCPF() {
    return (<Col s={12} m={3}>
      <div className="">
        <h6>CPF:</h6>
        <label>
          <MaskedInput type="text" mask="111.111.111-11" name="filter_cpf" value={this.state.filter_cpf} onChange={this.handleInputFilterChange.bind(this)}/>
        </label>
      </div>
    </Col>)
  }

  pickCityHall() {
    const cityHallList = (this.state.collections.city_halls.map((city_hall) => {
      return (<option value={city_hall.id}>{city_hall.name}</option>)
    }))
    return (<Col s={12} m={3}>
      <div>
        <h6>Prefeitura:</h6>
        <Input name="filter_city_hall" type='select' value={this.state.filter_city_hall} onChange={(event) => {
            var selected_city_hall = event.target.value
            if (this.state.filter_city_hall != selected_city_hall) {
              this.setState({filter_city_hall: selected_city_hall});
            }
          }
}>
          <option value={''}>Todas</option>
          {cityHallList}
        </Input>
      </div>
    </Col>)
  }

  pickProfessional() {
    const professionalList = (this.state.collections.professionals.map((professional) => {
      return (<option value={professional.id}>{professional.name}</option>)
    }))
    return (<Col s={12} m={3}>
      <div>
        <h6>Profissional:</h6>
        <Input name="filter_professional" type='select' value={this.state.filter_professional} onChange={(event) => {
            var selected_professional = event.target.value
            if (this.state.filter_professional != selected_professional) {
              this.setState({filter_professional: selected_professional});
            }
          }
}>
          <option value={''}>Todos</option>
          {professionalList}
        </Input>
      </div>
    </Col>)
  }

  pickServiceType() {
    const service_typeList = (this.state.collections.service_types.map((service_type) => {
      return (<option value={service_type.id}>{service_type.description}</option>)
    }))
    return (<Col s={12} m={3}>
      <div>
        <h6>Tipo de Atendimento:</h6>
        <Input name="filter_service_type" type='select' value={this.state.filter_service_type} onChange={(event) => {
            var selected_service_type = event.target.value
            if (this.state.filter_service_type != selected_service_type) {
              this.setState({filter_service_type: selected_service_type});
            }
          }
}>
          <option value={''}>Todos</option>
          {service_typeList}
        </Input>
      </div>
    </Col>)
  }

  pickServicePlace() {
    const servicePlaceList = (this.state.collections.service_places.map((service_place) => {
      return (<option value={service_place.id}>{service_place.name}</option>)
    }))
    return (<Col s={12} m={3}>
      <div>
        <h6>Local de Atendimento:</h6>
        <Input name="filter_service_place" type='select' value={this.state.filter_service_place} onChange={(event) => {
            var selected_service_place = event.target.value
            if (this.state.filter_service_place != selected_service_place) {
              this.setState({filter_service_place: selected_service_place});
            }
          }
}>
          <option value={''}>Todos</option>
          {servicePlaceList}
        </Input>
      </div>
    </Col>)
  }

  pickSituation() {
    //The situation cames with available so slice skip the first element
    const situationList = (this.state.collections.situation.slice(1).map((situation) => {
      return (<option value={situation.id}>{situation.description}</option>)
    }))
    return (<Col s={12} m={3}>
      <div>
        <h6>Situação:</h6>
        <Input name="filter_situation" type='select' value={this.state.filter_situation} onChange={(event) => {
            var selected_situation = event.target.value
            if (this.state.filter_situation != selected_situation) {
              this.setState({filter_situation: selected_situation});
            }
          }
}>
          <option value={''}>Todos</option>
          {situationList}
        </Input>
      </div>
    </Col>)
  }

  handleFilterSubmit(sort_only) {
    var name
    var cpf
    var professional
    var situation
    var service_place
    var service_type
    var city_hall
    var current_page

    if (sort_only) {
      name = this.state.last_fetch_name
      cpf = this.state.last_fetch_cpf
      professional = this.state.last_fetch_professional
      situation = this.state.last_fetch_situation
      service_place = this.state.last_fetch_service_place
      service_type = this.state.last_fetch_service_type
      city_hall = this.state.last_fetch_city_hall
    } else {
      name = this.state.filter_name
      cpf = this.state.filter_cpf
      professional = this.state.filter_professional
      situation = this.state.filter_situation
      service_place = this.state.filter_service_place
      service_type = this.state.filter_service_type
      city_hall = this.state.filter_city_hall
    }
    cpf = cpf.replace(/(\.|-)/g, '');
    name = name.replace(/\s/g, '+')

    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `/schedules`;
    const params = `not_available=true`
                    + `&permission=${this.props.user.current_role}`
                    + `&q[name]=${name}`
                    + `&q[cpf]=${cpf}`
                    + `&q[professional]=${professional}`
                    + `&q[situation]=${situation}`
                    + `&q[service_place]=${service_place}`
                    + `&q[service_type]=${service_type}`
                    + `&q[city_hall]=${city_hall}`
                    + `&q[s]=${this.state.filter_s}`
                    + `&page=${this.state.current_page}`

    current_page = sort_only
      ? this.state.current_page
      : 1

    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "get"
    }).then(parseResponse).then(resp => {
      this.setState({
            schedules: resp.entries,
            num_entries: resp.num_entries,
            last_fetch_name: name,
            last_fetch_cpf: cpf,
            last_fetch_professional: professional,
            last_fetch_situation: situation,
            last_fetch_service_place: service_place,
            last_fetch_service_type: service_type,
            last_fetch_city_hall: city_hall,
            current_page: current_page
      })
    });
  }

  handleInputFilterChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (target.validity.valid) {
      this.setState({[name]: value})
    }
  }

  tableList() {
    var date
    var aux_start_time
    var aux_end_time
    var start_time
    var end_time
    var citizen_cpf
    const data = (this.state.schedules.map((schedule) => {
      citizen_cpf = 0;
      citizen_cpf = this.formatCPF(schedule.citizen_cpf);
      date = strftime.timezone('+0000')('%d/%m/%Y', new Date(schedule.service_start_time))
      aux_start_time = new Date(schedule.service_start_time)
      aux_end_time = new Date(schedule.service_end_time)
      start_time = this.addZeroBefore(aux_start_time.getHours()) + ":" + this.addZeroBefore(aux_start_time.getMinutes())
      end_time = this.addZeroBefore(aux_end_time.getHours()) + ":" + this.addZeroBefore(aux_end_time.getMinutes())
      return (<tr>
        <td>
          {schedule.citizen_name}
        </td>
        <td>
          {citizen_cpf}
        </td>
        <td>
          {date}
        </td>
        <td>
          {`${start_time} até ${end_time}`}
        </td>
        <td>
          {schedule.professional_name}
        </td>
        <td>
          {schedule.service_place}
        </td>
        <td>
          {schedule.service_type}
        </td>
        <td>
          {schedule.situation_description}
        </td>
        {
          schedule.situation_description == 'Cidadão compareceu com atraso' || schedule.situation_description == 'Profissional compareceu com atraso' || schedule.situation_description == 'Atendimento realizado' || schedule.situation_description == 'Agendado'
            ? <td>
                {this.createScheduleReport.bind(this)(schedule)}
              </td>
            : <td>
                <p>Indisponível</p>
              </td>
        }
        {
          schedule.situation_description == 'Agendado'
            ? <td>
                <a className='back-bt waves-effect btn-flat' onClick={() => browserHistory.push(`/schedules/service/${schedule.id}/edit`)}>
                  <i className="waves-effect material-icons tooltipped">
                    update
                  </i>
                </a>
              </td>
            : <td>
                <p>Indisponível</p>
              </td>
        }
      </tr>)
    }))

    // Fields to show in the table, and what object properties in the data they bind to
    const fields = (<tr>
      <th>Cidadão</th>
      <th>{this.sortableColumn.bind(this)('CPF', 'citizen_cpf')}</th>
      <th>{this.sortableColumn.bind(this)('Data', 'service_start_time')}</th>
      <th>{this.sortableColumn.bind(this)('Horário', 'service_start_time')}</th>
      <th>{this.sortableColumn.bind(this)('Profissional', 'professional_name')}</th>
      <th>{this.sortableColumn.bind(this)('Local de Atendimento', 'service_place')}</th>
      <th>{this.sortableColumn.bind(this)('Tipo de atendimento', 'service_type')}</th>
      <th>{this.sortableColumn.bind(this)('Situação', 'situation_description')}</th>
      <th>Relatório</th>
      <th>Mudar situação</th>

    </tr>)

    var num_items_per_page = 25
    var num_pages = Math.ceil(this.state.num_entries / num_items_per_page)

    return (<div>
      <p className={styles['description-column']}>
        Mostrando {
          num_pages != 0
            ? this.state.current_page == num_pages
              ? this.state.num_entries % num_items_per_page == 0
                ? ` ${num_items_per_page} `
                : ` ${this.state.num_entries % num_items_per_page} `
              : ` ${num_items_per_page} `
            : ' 0 '

        }
        de {this.state.num_entries} registros
      </p>
      <br/>
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
      <br/>
      <Pagination value={this.state.current_page} onSelect={(val) => {
          this.setState({
            current_page: val
          }, () => {
            this.handleFilterSubmit.bind(this)(true)
          })
        }
} className={styles['pagination']} items={Math.ceil(this.state.num_entries / num_items_per_page)} activePage={this.state.current_page} maxButtons={8}/>
    </div>)
  }

  sortableColumn(title, name) {
    return (<a href='#' onClick={() => {
        this.setState({
          ['filter_s']: this.state.filter_s == `${name}+asc`
            ? `${name}+desc`
            : `${name}+asc`
        }, this.handleFilterSubmit.bind(this,true))
      }
}>
      {title}
      {
        this.state.filter_s == `${name}+asc`
          ? <i className="waves-effect material-icons tiny tooltipped">
              arrow_drop_down
            </i>
          : this.state.filter_s == `${name}+desc`
            ? <i className="waves-effect material-icons tiny tooltipped">
                arrow_drop_up
              </i>
            : <div/>
      }
    </a>)
  }

  createScheduleReport(schedule) {

      var col =["ID", "Tipo de Serviço", "Situação", "Nome do profissional", "ID Profissional", "Horário de Início", "Horário de Fim", "Nome do cidadão", "CPF do cidadão"];
      var row = [];
      row.push([schedule.id, schedule.service_type,  schedule.situation_description, schedule.professional_name, schedule.professional_performer_id, this.formatDateTime(schedule.service_start_time), this.formatDateTime(schedule.service_end_time) ,schedule.citizen_name, schedule.citizen_cpf]);

    return(
        <ReportPDF icon="print" h1="Relatório de Atendimento" h2="" cols={col} rows={row} filename="relatorio_atendimentos.pdf" o='l'/>
    );
  }

  addZeroBefore(n) {
    return (
      n < 10
      ? '0'
      : '') + n;
  }

  formatCPF(n) {
    n = n.replace(/\D/g, "");
    n = n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
    return (n);
  }

  formatDateTime(dateTime){
    var dateText = new Date(dateTime)
    var returnText = this.addZeroBefore(dateText.getHours()) + ":" + this.addZeroBefore(dateText.getMinutes()) + " - " + dateText.getDate() + "/" + (dateText.getMonth() + 1) + "/" + dateText.getFullYear()

    return(returnText)
  }

  render() {
    return (<main>
      <Row>
        <Col s={12}>
          {this.mainComponent()}
        </Col>
      </Row>
    </main>)
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  const current_role = user.roles[user.current_role_idx]
  return {user, current_role}
}

const ServiceList = connect(mapStateToProps)(getServiceList)
export default ServiceList
