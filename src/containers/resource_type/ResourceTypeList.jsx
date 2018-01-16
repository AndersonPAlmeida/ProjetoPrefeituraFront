import React, {Component} from 'react';
import { Link } from 'react-router';
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize';
import styles from './styles/ResourceTypeList.css';
import 'react-day-picker/lib/style.css';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';

class getResourceTypeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceTypes: [],
      filter_name: '',
      filter_description: '',
      last_fetch_name: '',
      last_fetch_description: '',
      filter_s: '',
      city_hall:{}
    };
    this.getCityHallName = this.getCityHallName.bind(this);      
  }

  componentWillMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'resource_types';
    const params = `permission=${this.props.user.current_role}`;
    this.getCityHallName();    
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ resourceTypes: resp });
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
    );
  }

  getCityHallName() {
    var city_halls = {};
    city_halls = this.state.city_hall;
    
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'city_halls/';
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      resp.entries.sort(function(a,b) {return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);} );
      self.setState({ city_hall: resp.entries });
    });
  }

  tableList() {
    var current_role = this.props.user.current_role;
    var user_roles = this.props.user.roles;
    var current_permission = undefined;
    for (let i = 0; i < user_roles.length; i++){
      if (user_roles[i].id === current_role){
        current_permission = user_roles[i].role; 
        break;
      }
    }
    const data = (
      this.state.resourceTypes.map((resourceType) => {
        return (
          <tr>
            <td key={Math.random()} >
              <a className='back-bt waves-effect btn-flat' 
                href='#' 
                onClick={ () => 
                  browserHistory.push(`/resource_types/${resourceType.id}`) 
                }>
                {resourceType.name}
              </a>
            </td>
            <td key={Math.random()} className='description-column' >
              {resourceType.description}
            </td>
            <td key={Math.random()} >
              {resourceType.mobile === 'false' ? 'Não' : 'Sim'}
            </td>
            <td key={Math.random()} >
              {resourceType.active ? 'Ativo' : 'Inativo'}
            </td>
            <td key={Math.random()}>
              {
                this.state.city_hall[resourceType.city_hall_id-1].name 
              }
            </td>
            <td key={Math.random()} >
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
        );
      })
    );

    // Fields to show in the table, and what object properties in the data they bind to
    const fields = (
      <tr>
        <th>
          <a 
            href='#' 
            className="grey-text text-darken-3 "
            onClick={ 
              () => { 
                if (this.state.filter_s == 'name+asc'){
                  document.getElementById('ascNameIcon').style.display = 'none';
                  document.getElementById('descNameIcon').style.display = 'inline-block';                    
                } 
                else{
                  document.getElementById('descNameIcon').style.display = 'none';               
                  document.getElementById('ascNameIcon').style.display = 'inline-block';
                }
                  
                this.setState({
                  ['filter_s']: this.state.filter_s == 'name+asc' ? 'name+desc' : 'name+asc'
                }, this.handleFilterSubmit.bind(this,true));
              }
            }
          >
            Nome
            <i className="waves-effect material-icons tiny tooltipped" id="ascNameIcon" style={{display:'none'}}>
              arrow_drop_down
            </i>
            <i className="waves-effect material-icons tiny tooltipped" id="descNameIcon" style={{display:'none'}}>
              arrow_drop_up
            </i>
          </a>
        </th>
        <th>Descrição</th>

        <th>
          <a 
            href='#' 
            className="grey-text text-darken-3 "
            onClick={ 
              () => { 
                if (this.state.filter_s == 'mobile+asc'){
                  document.getElementById('ascMobileIcon').style.display = 'none';
                  document.getElementById('descMobileIcon').style.display = 'inline-block';                    
                } 
                else{
                  document.getElementById('descMobileIcon').style.display = 'none';               
                  document.getElementById('ascMobileIcon').style.display = 'inline-block';
                }
                  
                this.setState({
                  ['filter_s']: this.state.filter_s == 'mobile+asc' ? 'mobile+desc' : 'mobile+asc'
                }, this.handleFilterSubmit.bind(this,true));
              }
            }
          >
            Móvel
            <i className="waves-effect material-icons tiny tooltipped" id="ascMobileIcon" style={{display:'none'}}>
              arrow_drop_down
            </i>
            <i className="waves-effect material-icons tiny tooltipped" id="descMobileIcon" style={{display:'none'}}>
              arrow_drop_up
            </i>
          </a>
        </th>


        <th>Situação</th>


        <th>
          <a 
            href='#' 
            className="grey-text text-darken-3 "
            onClick={ 
              () => { 
                if (this.state.filter_s == 'city_hall_id+asc'){
                  document.getElementById('ascCityHallIcon').style.display = 'none';
                  document.getElementById('descCityHallIcon').style.display = 'inline-block';                    
                } 
                else{
                  document.getElementById('descCityHallIcon').style.display = 'none';               
                  document.getElementById('ascCityHallIcon').style.display = 'inline-block';
                }
                  
                this.setState({
                  ['filter_s']: this.state.filter_s == 'city_hall_id+asc' ? 'city_hall_id+desc' : 'city_hall_id+asc'
                }, this.handleFilterSubmit.bind(this,true));
              }
            }
          >
            Prefeitura
            <i className="waves-effect material-icons tiny tooltipped" id="ascCityHallIcon" style={{display:'none'}}>
              arrow_drop_down
            </i>
            <i className="waves-effect material-icons tiny tooltipped" id="descCityHallIcon" style={{display:'none'}}>
              arrow_drop_up
            </i>
          </a>
        </th>


        <th></th>
      </tr>
    );

    return (
      <div className={'table-size'} id='table-resource-type'>
        <table className={styles['table-list']}>
          <thead>
            {fields}
          </thead>
          <tbody>
            {data}
          </tbody>
        </table>
      </div>
    );
  }

  handleInputFilterChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  filterResourceType() {
    return (
      <div>
        <Row id='filterRow'>
          <Col s={12} m={6}>
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
          <Col s={12} m={6}>
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
        <div className='right' id='createResourceTypeButton'>
          {this.newResourceTypeButton()}
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
    );
  }

  handleFilterSubmit(sort_only) {
    var name;
    var description;
    if(sort_only) {
      name = this.state.last_fetch_name;
      description = this.state.last_fetch_description;
    } else {
      name = this.state.filter_name;
      description = this.state.filter_description;
    }
    name = name.replace(/\s/g,'+');
    description = description.replace(/\s/g,'+');
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'resource_types';
    const params = `permission=${this.props.user.current_role}&q[name]=${name}&q[description]=${description}&q[s]=${this.state.filter_s}`;
    console.log(`${apiUrl}/${collection}?${params}`);
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      this.setState({
        resourceTypes: resp,
        last_fetch_name: name,
        last_fetch_description: description
      });
    });
  }

  newResourceTypeButton() {
    return (
      <button 
        onClick={() =>
          browserHistory.push({ pathname: '/resource_types/new'}) 
        }
        className="btn waves-effect btn button-color" 
        name="anterior" 
        type="submit">
          CADASTRAR NOVO TIPO DE RECURSO
      </button>
    );
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
    );
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo']);
  return {
    user
  };
};

const ResourceTypeList = connect(
  mapStateToProps
)(getResourceTypeList);
export default ResourceTypeList;
