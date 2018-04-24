import React, {Component} from 'react';
import { Link } from 'react-router';
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize';
import styles from './styles/ResourceList.css';
import 'react-day-picker/lib/style.css';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import strftime from 'strftime';


// {
//   active  :  1
//   brand  :  "Lenovo"
//   created_at  :  "2017-11-23T10:45:51.909-02:00"
//   id  :  1
//   label  :  "NB-1"
//   maximum_schedule_time  :  2
//   minimum_schedule_time  :  0.5
//   model  :  "Thinkpad Carbon X1"
//   note  :  "SN:1407124942335"
//   professional_responsible_id  :  1
//   resource_types_id  :  1
//   service_place_id  :  1
//   updated_at  :  "2017-11-23T10:45:51.909-02:00"
// }

class getResourceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      filter_label: '',
      filter_model: '',
      filter_brand: '',
      last_fetch_label: '',
      last_fetch_model: '',
      last_fetch_brand: '',
      filter_s: '',
      city_hall:[],
      resource_types:[],
      service_places:[],
      current_permission: ''
    };
    this.getCityHallName = this.getCityHallName.bind(this);      
    this.getResourceType = this.getResourceType.bind(this);      
    this.getServicePlace = this.getServicePlace.bind(this);      
  }

  componentWillMount() {
    var current_role = this.props.user.current_role;
    var user_roles = this.props.user.roles;
    var current_permission = undefined;
    for (let i = 0; i < user_roles.length; i++){
      if (user_roles[i].id === current_role){
        current_permission = user_roles[i].role; 
        break;
      }
    }
    this.setState({current_permission: current_permission});
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'resources';
    const params = `permission=${this.props.user.current_role}`;
    this.getResourceType();
    if (current_permission == 'adm_c3sl' || current_permission == 'adm_prefeitura'){
      this.getServicePlace();
      if(current_permission == 'adm_c3sl'){
        this.getCityHallName();   
      }
    }
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ resources: resp });
    });
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Recurso </h2>
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
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'city_halls/';
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ city_hall: resp });
    });
  }
  getResourceType() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'resource_types/';
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      resp.sort(function(a,b) {return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);} );      
      self.setState({ resource_types: resp });
    });
  }
  getServicePlace() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'service_places/';
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(completeResp => {
      let resp = completeResp.entries;
      resp.sort(function(a,b) {return (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0);} );      
      self.setState({ service_places: resp });
    });
  }
  tableList() {
    const data = (
      this.state.resources.map((resource) => {
        return (
          <tr>
            <td key={Math.random()}  >
              {
                this.state.resource_types.find(o => o.id === resource.resource_types_id).name
              }
            </td>
            <td key={Math.random()} >
              {resource.label}
            </td>
            <td key={Math.random()}  >
              {resource.brand}
            </td>
            <td key={Math.random()} >
              {resource.model}
            </td>            
            <td key={Math.random()} >
              {resource.active ? 'Ativo' : 'Inativo'}
            </td>
            
            <td key={Math.random()} >
              {
                this.state.current_permission == 'adm_c3sl' || this.state.current_permission == 'adm_prefeitura' ? 
                  this.state.service_places.find(o => o.id === resource.service_place_id).name :
                  undefined
              }
            </td>

            <td key={Math.random()} >
              <a className='back-bt waves-effect btn-flat' 
                id="iconTable"
                href='#' 
                onClick={ () => 
                  browserHistory.push(`/resources/${resource.id}/edit`) 
                }>
                <i className="waves-effect material-icons tooltipped">
                    edit
                </i>
              </a>

              <a className='back-bt waves-effect btn-flat' 
                id="iconTable"
                href='#' 
                onClick={ () => 
                  browserHistory.push(`/resources/${resource.id}`) 
                }>
                <i className="waves-effect material-icons tooltipped">
                    visibility
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
                if (this.state.filter_s == 'resource_types_id+asc'){
                  document.getElementById('ascTypeIcon').style.display = 'none';
                  document.getElementById('descTypeIcon').style.display = 'inline-block';                    
                } 
                else{
                  document.getElementById('descTypeIcon').style.display = 'none';               
                  document.getElementById('ascTypeIcon').style.display = 'inline-block';
                }
                  
                this.setState({
                  ['filter_s']: this.state.filter_s == 'resource_types_id+asc' ? 'resource_types_id+desc' : 'resource_types_id+asc'
                }, this.handleFilterSubmit.bind(this,true));
              }
            }
          >
            Tipo
            <i className="waves-effect material-icons tiny tooltipped" id="ascTypeIcon" style={{display:'none'}}>
              arrow_drop_down
            </i>
            <i className="waves-effect material-icons tiny tooltipped" id="descTypeIcon" style={{display:'none'}}>
              arrow_drop_up
            </i>
          </a>
        </th>
        <th>
          <a 
            href='#' 
            className="grey-text text-darken-3 "
            onClick={ 
              () => { 
                if (this.state.filter_s == 'label+asc'){
                  document.getElementById('ascLabelIcon').style.display = 'none';
                  document.getElementById('descLabelIcon').style.display = 'inline-block';                    
                } 
                else{
                  document.getElementById('descLabelIcon').style.display = 'none';               
                  document.getElementById('ascLabelIcon').style.display = 'inline-block';
                }
                  
                this.setState({
                  ['filter_s']: this.state.filter_s == 'label+asc' ? 'label+desc' : 'label+asc'
                }, this.handleFilterSubmit.bind(this,true));
              }
            }
          >
            Etiqueta
            <i className="waves-effect material-icons tiny tooltipped" id="ascLabelIcon" style={{display:'none'}}>
              arrow_drop_down
            </i>
            <i className="waves-effect material-icons tiny tooltipped" id="descLabelIcon" style={{display:'none'}}>
              arrow_drop_up
            </i>
          </a>
        </th>

        <th>
          <a 
            href='#' 
            className="grey-text text-darken-3 "
            onClick={ 
              () => { 
                if (this.state.filter_s == 'brand+asc'){
                  document.getElementById('ascBrandIcon').style.display = 'none';
                  document.getElementById('descBrandIcon').style.display = 'inline-block';                    
                } 
                else{
                  document.getElementById('descBrandIcon').style.display = 'none';               
                  document.getElementById('ascBrandIcon').style.display = 'inline-block';
                }
                  
                this.setState({
                  ['filter_s']: this.state.filter_s == 'brand+asc' ? 'brand+desc' : 'brand+asc'
                }, this.handleFilterSubmit.bind(this,true));
              }
            }
          >
            Marca
            <i className="waves-effect material-icons tiny tooltipped" id="ascBrandIcon" style={{display:'none'}}>
              arrow_drop_down
            </i>
            <i className="waves-effect material-icons tiny tooltipped" id="descBrandIcon" style={{display:'none'}}>
              arrow_drop_up
            </i>
          </a>
        </th>

        <th>
          <a 
            href='#' 
            className="grey-text text-darken-3 "
            onClick={ 
              () => { 
                if (this.state.filter_s == 'model+asc'){
                  document.getElementById('ascModelIcon').style.display = 'none';
                  document.getElementById('descModelIcon').style.display = 'inline-block';                    
                } 
                else{
                  document.getElementById('descModelIcon').style.display = 'none';               
                  document.getElementById('ascModelIcon').style.display = 'inline-block';
                }
                  
                this.setState({
                  ['filter_s']: this.state.filter_s == 'model+asc' ? 'model+desc' : 'model+asc'
                }, this.handleFilterSubmit.bind(this,true));
              }
            }
          >
            Modelo
            <i className="waves-effect material-icons tiny tooltipped" id="ascModelIcon" style={{display:'none'}}>
              arrow_drop_down
            </i>
            <i className="waves-effect material-icons tiny tooltipped" id="descModelIcon" style={{display:'none'}}>
              arrow_drop_up
            </i>
          </a>
        </th>

        
        <th>Situação</th>
        {
          this.state.current_permission == 'adm_c3sl' || this.state.current_permission == 'adm_prefeitura' ? 
            <th>Local do recurso</th> :
            <th></th>
        }
        <th></th>
      </tr>
    );

    return (
      <div className={'table-size'}>
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
          <Col s={12} m={4}>
            <div>
              <h6>Marca:</h6>
              <label>
                <input
                  type="text"
                  name="filter_brand"
                  value={this.state.filter_brand}
                  onChange={this.handleInputFilterChange.bind(this)}
                />
              </label>
            </div>
          </Col>

          <Col s={12} m={4}>
            <div>
              <h6>Modelo:</h6>
              <label>
                <input
                  type="text"
                  name="filter_model"
                  value={this.state.filter_model}
                  onChange={this.handleInputFilterChange.bind(this)}
                />
              </label>
            </div>
          </Col>
          <Col s={12} m={4}>
            <div >
              <h6>Etiqueta:</h6>
              <label>
                <input
                  type="text"
                  name="filter_label"
                  value={this.state.filter_label}
                  onChange={this.handleInputFilterChange.bind(this)}
                />
              </label>
            </div>
          </Col>
        </Row>

        <div className='right' id='createResourceButton'>
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
    var label;
    var model;
    var brand;
    if(sort_only) {
      label = this.state.last_fetch_label;
      model = this.state.last_fetch_model;
      brand = this.state.last_fetch_brand; 
    } else {
      label = this.state.filter_label;
      model = this.state.filter_model;
      brand = this.state.filter_brand;
    }
    label = label.replace(/\s/g,'+');
    model = model.replace(/\s/g,'+');
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'resources';
    const params = `permission=${this.props.user.current_role}&q[brand]=${brand}&q[label]=${label}&q[model]=${model}&q[s]=${this.state.filter_s}`;

    console.log(`${apiUrl}/${collection}?${params}`);
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      this.setState({
        resources: resp,
        last_fetch_label: label,
        last_fetch_model: model
      });
    });
  }

  newResourceTypeButton() {
    return (
      <button 
        onClick={() =>
          browserHistory.push({ pathname: '/resources/new'}) 
        }
        className="btn waves-effect btn button-color" 
        name="anterior" 
        type="submit">
          CADASTRAR RECURSO
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

const ResourceList = connect(
  mapStateToProps
)(getResourceList);
export default ResourceList;
