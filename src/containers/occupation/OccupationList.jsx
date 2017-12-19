import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/OccupationList.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';

class getOccupationList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          occupations: [],
          filter_name: '',
          filter_description: '',
          last_fetch_name: '',
          last_fetch_description: '',
          filter_s: ''
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `occupations`;
    const params = `permission=${this.props.user.current_role}`

    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ occupations: resp.entries })
    });
  }

  mainComponent() {
    return (
      <div className='card card-occupation' >
        <div className='card-content'>
          <h2 className='card-title h2-title-home'>Cargos</h2>
          {this.filterOccupation()}
          {this.tableList()}
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
      this.state.occupations.map((occupation) => {
        return (
          <tr>
            <td>
              <a className='back-bt waves-effect btn-flat'
                href='#'
                onClick={ () =>
                  browserHistory.push(`/occupations/${occupation.id}`)
                }>
                {occupation.name}
              </a>
            </td>
            <td className='description-column' >
              {occupation.description}
            </td>
            <td>
              {occupation.active ? 'Ativo' : 'Inativo'}
            </td>
            <td>
              <a className='back-bt waves-effect btn-flat'
                 href='#'
                 onClick={ () =>
                 browserHistory.push(`/occupations/${occupation.id}/edit`)
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

  filterOccupation() {
    return (
      <div>
      <Row className="row-occupation">
          <Col s={12} m={4}  >
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
          <Col s={12} m={4}>
            <div>
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
        </Row>

          <Row>
            <Col>
              <button className="waves-effect btn button-green search-button" onClick={this.handleFilterSubmit.bind(this,false)} name="commit" type="submit">BUSCAR </button>
            </Col>
            <Col>
              <button className="waves-effect btn button-white clean-button" onClick={this.cleanFilter.bind(this)} name="commit">LIMPAR CAMPOS  </button>
            </Col>
            <Col>
              {this.newOccupationButton()}
            </Col>
          </Row>
      </div>
    )
  }

  cleanFilter() {
    this.setState({
      'filter_description': '',
      'filter_name': '',
    })
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `occupations`;
    const params = `permission=${this.props.user.current_role}`

    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ occupations: resp.entries })
    });
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
    const collection = `occupations`;
    const params = `permission=${this.props.user.current_role}&q[name]=${name}&q[description]=${description}&q[s]=${this.state.filter_s}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      this.setState({
        occupations: resp.entries,
        last_fetch_name: name,
        last_fetch_description: description
      })
    });
  }
	newOccupationButton() {
		return (
			<button
        onClick={() =>

          browserHistory.push({ pathname: `/occupations/new`})
        }
        className="waves-effect btn button-green new-occupation-button"
        name="new occupation"
        type="submit">
          INSERIR NOVO CARGO
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

const OccupationList = connect(
  mapStateToProps
)(getOccupationList)
export default OccupationList
