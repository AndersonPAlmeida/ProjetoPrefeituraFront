import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ResourceTypeList.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';

class getResourceTypeList extends Component {
  constructor(props) {
      super(props)
      this.state = {
          resourceTypes: [],
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
    const collection = `resource_types`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ resourceTypes: resp })
    });
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Tipo de Recurso </h2>
          {this.filterResourceType()}
          {this.tableList()}
        </div>
        <div className="card-action">
          {this.newResourceTypeButton()}
        </div>
      </div>
      )
  }
  
	tableList() {
    const data = (
      this.state.resourceTypes.map((resourceType) => {
        return (
          <tr>
            <td>
              <a className='back-bt waves-effect btn-flat' 
                href='#' 
                onClick={ () => 
                  browserHistory.push(`/resource_types/${resourceType.id}`) 
                }>
                {resourceType.name}
              </a>
            </td>
            <td className='description-column' >
              {resourceType.description}
            </td>
            <td>
              {resourceType.active ? 'Ativo' : 'Inativo'}
            </td>
            <td>
              <a className='back-bt waves-effect btn-flat' 
                 href='#' 
                 onClick={ () => 
                 browserHistory.push(`/resource_types/${resourceType.id}/edit`) 
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
        <th>Descrição</th>
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

  filterResourceType() {
    return (
      <div>
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
        <button 
          id="filterBtn"
          className="waves-effect btn right button-color" 
          onClick={this.handleFilterSubmit.bind(this,false)} 
          name="commit" 
          type="submit">
            FILTRAR
        </button>
      </div>
    )
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
    const collection = `resource_types`;
    const params = `permission=${this.props.user.current_role}&q[name]=${name}&q[description]=${description}&q[s]=${this.state.filter_s}`
    console.log(`${apiUrl}/${collection}?${params}`)
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      this.setState({
        resourceTypes: resp,
        last_fetch_name: name,
        last_fetch_description: description
      })
    });
  }

	newResourceTypeButton() {
		return (
			<button 
        onClick={() =>
          browserHistory.push({ pathname: `/resource_types/new`}) 
        }
        className="btn waves-effect btn button-color" 
        name="anterior" 
        type="submit">
          CADASTRAR NOVO TIPO DE RECURSO
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

const ResourceTypeList = connect(
  mapStateToProps
)(getResourceTypeList)
export default ResourceTypeList
