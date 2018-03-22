import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input, Pagination } from 'react-materialize'
import styles from './styles/DependantList.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';

class getDependantList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          dependants: [],
          filter_name: '',
          last_fetch_name: '',
          filter_s: '',
          num_entries: 0,
          current_page: 1
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `citizens/${this.props.user.citizen.id}/dependants`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ 
                      dependants: resp.entries,
                      num_entries: resp.num_entries
                    })
    });
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Dependente </h2>
          {this.filterDependant()}
          {this.state.dependants.length > 0 ? this.tableList() : '- Nenhum dependente encontrado'}
        </div>
        <div className="card-action">
          {this.newDependantButton()}
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
      this.state.dependants.map((dependant) => {
        return (
          <tr>
            <td>
              {dependant.name}
            </td>
            <td>
              {strftime.timezone('+0000')('%d/%m/%Y', new Date(dependant.birth_date))}
            </td>
            <td>
              {this.formatCPF(dependant.cpf)}
            </td>
            <td>
              <a className='back-bt waves-effect btn-flat' 
                href='#' 
                onClick={ () => 
                  browserHistory.push(`/dependants/${dependant.id}`) 
                }>
                  <i className="waves-effect material-icons tooltipped">
                    visibility
                  </i>
              </a>
            </td>
            <td>
              <a className='back-bt waves-effect btn-flat' 
                 href='#' 
                 onClick={ () => 
                 browserHistory.push(`/dependants/${dependant.id}/edit`) 
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
        <th>{this.sortableColumn.bind(this)('Nome','citizen_name')}</th>
        <th>{this.sortableColumn.bind(this)('Data de Nascimento','citizen_birth_date')}</th>
        <th>{this.sortableColumn.bind(this)('CPF','citizen_cpf')}</th>
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

    this.setState({
      [name]: value
    })
  }

  filterDependant() {
    return (
      <div>
        <Row s={12}></Row>
        <Row s={12}>
          <Col s={12} m={3}>
            <h6>Nome:</h6>
            <label>
              <input
                type="text"
                name="filter_name"
                value={this.state.filter_name}
                onChange={this.handleInputFilterChange.bind(this)}
              />
            </label>
          </Col>
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
      'filter_name': ''
    })
  }

  handleFilterSubmit(sort_only) {
    var name
    var current_page
    if(sort_only) {
      name = this.state.last_fetch_name
    } else {
      name = this.state.filter_name
    }
    name = name.replace(/\s/g,'+')
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `citizens/${this.props.user.citizen.id}/dependants`;
    const params = `permission=${this.props.user.current_role}&q[name]=${name}&q[s]=${this.state.filter_s}`
    current_page = sort_only ? this.state.current_page : 1
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      this.setState({
        dependants: resp.entries,
        num_entries: resp.num_entries,
        last_fetch_name: name,
        current_page: current_page
      })
    });
  }

	newDependantButton() {
		return (
			<button 
        onClick={() =>
          browserHistory.push({ pathname: `/dependants/new`, query: {cep: this.props.user.citizen.cep}}) 
        }
        className="btn waves-effect btn button-color" 
        name="anterior" 
        type="submit">
          CADASTRAR NOVO DEPENDENTE
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
  return {
    user
  }
}

const DependantList = connect(
  mapStateToProps
)(getDependantList)
export default DependantList
