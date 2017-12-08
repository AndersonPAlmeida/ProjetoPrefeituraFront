import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input, Pagination } from 'react-materialize'
import styles from './styles/SectorList.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';

class getSectorList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          sectors: [],
          filter_name: '',
          filter_description: '',
          last_fetch_name: '',
          last_fetch_description: '',
          filter_s: '',
          num_entries: 0,
          current_page: 1
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `sectors`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      console.log(resp)
      self.setState({ 
                      sectors: resp.entries,
                      num_entries: resp.num_entries
                    })
    });
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Setor </h2>
          {this.filterSector()}
          {this.tableList()}
        </div>
        <div className="card-action">
          {this.newSectorButton()}
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
      this.state.sectors.map((sector) => {
        return (
          <tr>
            <td>
              <a className='back-bt waves-effect btn-flat' 
                href='#' 
                onClick={ () => 
                  browserHistory.push(`/sectors/${sector.id}`) 
                }>
                {sector.name}
              </a>
            </td>
            <td className='description-column' >
              {sector.description}
            </td>
            <td>
              {sector.active ? 'Ativo' : 'Inativo'}
            </td>
            <td>
              {sector.schedules_by_sector}
            </td>
            {
              this.props.user.roles[this.props.user.current_role_idx].role == 'adm_c3sl' ?
                <td>
                  {sector.city_hall_name}
                </td>
                :
                null
            }
            <td>
              <a className='back-bt waves-effect btn-flat' 
                 href='#' 
                 onClick={ () => 
                 browserHistory.push(`/sectors/${sector.id}/edit`) 
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
        <th>{this.sortableColumn.bind(this)('Agendamentos por setor','schedules_by_sector')}</th>
        {
          this.props.user.roles[this.props.user.current_role_idx].role == 'adm_c3sl' ?
            <th>{this.sortableColumn.bind(this)('Prefeitura','city_hall_name')}</th> :
            null
        }
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

  filterSector() {
    return (
      <div>
        <Row className='filter-container'>
          <Col>
            <div className="field-input" >
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
          <Col>
            <div className="field-input" >
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
      'filter_description': '',
      'filter_name': '',
    })
  }

  handleFilterSubmit(sort_only) {
    var name
    var description
    if(sort_only) {
      name = this.state.last_fetch_name
      description = this.state.last_fetch_description
    } else {
      name = this.state.filter_name
      description = this.state.filter_description
    }
    name = name.replace(/\s/g,'+')
    description = description.replace(/\s/g,'+')
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `sectors`;
    const params = `permission=${this.props.user.current_role}`
                    +`&q[name]=${name}`
                    +`&q[description]=${description}`
                    +`&q[s]=${this.state.filter_s}`
                    +`&page=${this.state.current_page}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      this.setState({
        sectors: resp.entries,
        num_entries: resp.num_entries,
        last_fetch_name: name,
        last_fetch_description: description,
        current_page: 1
      })
    });
  }

	newSectorButton() {
		return (
			<button 
        onClick={() =>
          browserHistory.push({ pathname: `/sectors/new`}) 
        }
        className="btn waves-effect btn button-color" 
        name="anterior" 
        type="submit">
          CADASTRAR NOVO SETOR
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

const SectorList = connect(
  mapStateToProps
)(getSectorList)
export default SectorList
