import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ProfessionalList.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';

class getProfessionalList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          professionals: [],
          filter_name: '',
          last_fetch_name: '',
          filter_s: ''
      };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `citizens/${this.props.user.citizen.id}/professionals`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ professionals: resp.entries })
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
              {strftime.timezone('+0000')('%d/%m/%Y', new Date(professional.birth_date))}
            </td>
            <td>
              {this.formatCPF(professional.cpf)}
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
        <th>Data de Nascimento</th>
        <th>CPF</th>
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

  filterProfessional() {
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
      'filter_name': ''
    })
  }

  handleFilterSubmit(sort_only) {
    var name
    if(sort_only) {
      name = this.state.last_fetch_name
    } else {
      name = this.state.filter_name
    }
    name = name.replace(/\s/g,'+')
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `citizens/${this.props.user.citizen.id}/professionals`;
    const params = `permission=${this.props.user.current_role}&q[name]=${name}&q[s]=${this.state.filter_s}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      this.setState({
        professionals: resp.entries,
        last_fetch_name: name
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
