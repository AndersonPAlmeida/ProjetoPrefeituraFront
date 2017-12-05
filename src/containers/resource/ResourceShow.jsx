import React, {Component} from 'react';
import { Link } from 'react-router';
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize';
import styles from './styles/ResourceShow.css';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from '../../redux-auth/utils/handle-fetch-response';
import {fetch} from '../../redux-auth';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

class getResourceTypeShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: {
        active: '',
        mobile: '',
        description: '',
        name: '',
      },
      current_permission: undefined,
      details:{},
      resource_type:{},
      service_place:{}
    };
    this.getDetails = this.getDetails.bind(this);

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
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resources/${this.props.params.resource_id}`;
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ resource: resp });
      this.getDetails(resp.id);
    });
  }

  getDetails(id) {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `resource_details/${id}`;
    const params = `permission=${this.props.user.current_role}`;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      method: 'get',
    }).then(parseResponse).then(resp => {
      self.setState({ details: resp });
      self.setState({ resource_type: resp.resource_type });
      self.setState({ service_place: resp.service_place });
    });
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Informações do Recurso: </h2>
          <Row>
            <Col s={12} m={6}>
              <Card className='' title={'Recurso'} >
                <p> 
                  <b>Tipo do recurso: </b>
                  {this.state.resource_type.name}
                </p> 
                <p> 
                  <b>Marca: </b>
                  {this.state.resource.brand}
                </p>
                <p> 
                  <b>Modelo: </b>
                  {this.state.resource.model}
                </p>
                <p> 
                  <b>Etiqueta: </b>
                  {this.state.resource.label}
                </p>
                <p> 
                  <b>Nota: </b>
                  {this.state.resource.note}
                </p>     
                <p> 
                  <b>Profissional responsável: </b>
                  {this.state.details.professional_name}
                </p>   
                <p> 
                  <b>Descrição do Recurso: </b>
                  {this.state.resource_type.description}
                </p> 
                <p> 
                  <b>Recurso Móvel: </b>
                  {this.state.resource_type.mobile == 'false' ? 'Não' : 'Sim' }
                </p> 
                <p> 
                  <b>Tempo mínimo da escala: </b>
                  {this.state.resource.minimum_schedule_time}
                  <span style={{marginLeft:3}}>h</span>
                </p>  
                <p> 
                  <b>Tempo máximo da escala: </b>
                  {this.state.resource.maximum_schedule_time}
                  <span style={{marginLeft:3}}>h</span>
                </p> 
                <p> 
                  <b>Situação: </b>
                  {this.state.resource.active ? 'Ativo' : 'Inativo'}
                </p>
              </Card>  
            </Col>
            <Col s={12} m={6}>
              <Card className='' title={'Local do Recurso'}>
                <p>
                  <b>Local do Recurso: </b>
                  {this.state.service_place.name}
                </p> 
                <p> 
                  <b>Endereço: </b>
                  {this.state.service_place.address_street}
                  <span style={{marginRight:4}}>,</span>
                  {this.state.service_place.address_number}                      
                </p>  
                <p> 
                  <b>Bairro: </b>
                  {this.state.service_place.neighborhood}                 
                </p> 
              </Card>  
            </Col>
          </Row>    
        </div>
        {this.editButton()}
      </div>
    );
  }

  editResource () {
    browserHistory.push(`resources/${this.props.params.resource_id}/edit`);
  }

  prev() {
    browserHistory.push('resources');
  }  

  editButton() {
    return (
      <div className="card-action">
        <a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
        <button id={'editResource'} className="waves-effect btn right" name="commit" onClick={this.editResource.bind(this)} type="submit">Editar</button>
      </div>
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
const ResourceTypeShow = connect(
  mapStateToProps
)(getResourceTypeShow);
export default ResourceTypeShow;
