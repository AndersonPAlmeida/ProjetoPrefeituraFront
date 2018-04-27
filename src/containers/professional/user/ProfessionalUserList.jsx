import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input, Pagination } from 'react-materialize'
import styles from './styles/ProfessionalUserList.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../../config/env';
import {parseResponse} from "../../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';
import MaskedInput from 'react-maskedinput';

class getProfessionalUserList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          city_halls: [],
          citizens: [],
          filter_name: '',
          filter_cpf: '',
          filter_city_hall: '',
          last_fetch_name: '',
          last_fetch_cpf: '',
          last_fetch_city_hall: '',
          filter_s: '',
          num_entries: 0,
          current_page: 1
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const params = `permission=${this.props.user.current_role}`
    var collection = `citizens`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({
                      citizens: resp.entries,
                      num_entries: resp.num_entries
                    })
    });

    if(this.props.current_role && this.props.current_role.role == 'adm_c3sl') {
      collection = `forms/citizen_index`
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
          method: "get",
      }).then(parseResponse).then(resp => {
        self.setState({
                        city_halls: resp.city_halls
                      })
      });
    }
  }

  mainComponent() {
    return (
      <div className='card card-user'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Cidadãos </h2>
          {this.filterCitizen()}
          {this.state.citizens.length > 0 ? this.tableList() : 'Nenhum cidadão encontrado'}
        </div>
        <div className="card-action">
          {this.newCitizenButton()}
        </div>
      </div>
      )
  }

  formatCPF(n) {
    n = n.replace(/\D/g,"");
    n = n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})$/,"$1.$2.$3-$4");
    return (n);
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
      this.state.citizens.map((citizen) => {
        return (
          <tr>
            <td>
              {citizen.name}
            </td>
            <td>
              {citizen.birth_date}
            </td>
            <td>
              {this.formatCPF(citizen.cpf)}
            </td>
            <td>
              {citizen.num_of_dependants}
            </td>
            <td>
              <a className='back-bt waves-effect btn-flat'
                href='#'
                onClick={ () =>
                  browserHistory.push(`/professionals/users/${citizen.id}`)
                }>

                <i className="waves-effect material-icons tooltipped">
                  visibility
                </i>
              </a>
            </td>
            <td>
              <a className='back-bt waves-effect btn-flat'
                 href='#'
                 onClick={(e) =>
                   {
                     e.preventDefault()
                     browserHistory.push({
                       pathname: `/professionals/users/${citizen.id}/edit`
                     })
                   }
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
        <th>{this.sortableColumn.bind(this)('Data de nascimento','birth_date')}</th>
        <th>{this.sortableColumn.bind(this)('CPF','cpf')}</th>
        <th>Dependentes</th>
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

  pickName() {
    return (
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
    )
  }

  pickCPF () {
    return (
      <Col s={12} m={3}>
        <div className="" >
          <h6>CPF:</h6>
          <label>
            <MaskedInput
              type="text"
              mask="111.111.111-11"
              name="filter_cpf"
              value={this.state.filter_cpf}
              onChange={this.handleInputFilterChange.bind(this)}
            />
          </label>
        </div>
      </Col>
    )
  }

  pickCityHall() {
    const cityHallList = (
      this.state.city_halls.map((city_hall) => {
        return (
          <option value={city_hall.city_id}>{city_hall.name}</option>
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

  filterCitizen() {
   return (
     <div>
       <Row s={12}></Row>
       <Row s={12}>
         {
           this.props.user && this.props.user.roles && this.props.user.roles[this.props.user.current_role_idx] &&
           this.props.user.roles[this.props.user.current_role_idx].role == 'adm_c3sl' ?
             this.pickCityHall() :
             null
         }
         {this.pickName()}
         {this.pickCPF()}
       </Row>
       <Row>
         <Col>
           <button className="waves-effect btn button-green search-button" onClick={this.handleFilterSubmit.bind(this,false)} name="commit" type="submit">FILTRAR</button>
         </Col>
         <Col>
           <button className="waves-effect btn button-white clean-button" onClick={this.cleanFilter.bind(this)} name="commit" type="submit">LIMPAR CAMPOS</button>
         </Col>
         <Col>
           {this.generateCitizenReportButton()}
         </Col>
       </Row>
       <Row>
         <Col>
           {this.newCitizenButton()}
         </Col>
         <Col>
           {this.newCitizenListButton()}
         </Col>
       </Row>
     </div>
   )
 }

  cleanFilter() {
    this.setState({
      'filter_name': '',
      'filter_cpf': '',
      'filter_city_hall': ''
    })
  }

  handleFilterSubmit(sort_only) {
    var name
    var cpf
    var city_hall
    var current_page
    if(sort_only) {
      name = this.state.last_fetch_name
      cpf = this.state.last_fetch_cpf
      city_hall = this.state.last_fetch_city_hall
    } else {
      name = this.state.filter_name
      cpf = this.state.filter_cpf
      city_hall = this.state.filter_city_hall
    }
    cpf = cpf.replace(/(\.|-)/g,'');
    name = name.replace(/\s/g,'+')
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = `/citizens`;
    const params = `permission=${this.props.user.current_role}`
                    +`&q[name]=${name}`
                    +`&q[cpf]=${cpf}`
                    +`&q[city_id]=${city_hall}`
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
        citizens: resp.entries,
        num_entries: resp.num_entries,
        last_fetch_name: name,
        last_fetch_cpf: cpf,
        last_fetch_city_hall: city_hall,
        current_page: current_page
      })
    });
  }

  newCitizenButton() {
        return (
            <button
        onClick={() =>
          browserHistory.push({pathname: `/professionals/users/new`})
        }
        className="btn waves-effect btn button-green new-user-button"
        name="Novo"
        type="submit">
          CADASTRAR NOVO CIDADÃO
      </button>
        )
    }

    newCitizenListButton() {
        return (
            <button
                onClick={() =>
                browserHistory.push({pathname: `/professionals/users/upload`})
      }
      className="btn waves-effect btn button-green new-user-button"
      name="upload"
      type="submit">
        INSERIR LISTA DE CIDADÃOS
    </button>
    )
    }


  generateCitizenReportButton() {
      return (
          <button
      onClick={() =>
        browserHistory.push({pathname: `/professionals/users/new`})
      }
      className="btn waves-effect btn button-blue user-report-button"
      name="Relatorio"
      type="submit">
        GERAR RELATÓRIO
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

const ProfessionalUserList = connect(
  mapStateToProps
)(getProfessionalUserList)
export default ProfessionalUserList
