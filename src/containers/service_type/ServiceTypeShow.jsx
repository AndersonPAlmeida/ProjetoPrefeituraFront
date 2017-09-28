import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ServiceTypeShow.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';

class getServiceTypeShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      update_address: 0,
      service_type: {
        account_id: '',
        active: '',
        address: {
          address: '',
          complement: '',
          complement2: '',
          id: '',
          neighborhood: '',
          zipcode: ''
        },
        address_complement: '',
        address_number: '',
        address_street: '',
        avatar_content_type: '',
        avatar_file_name: '',
        avatar_file_size: '',
        avatar_updated_at: '',
        birth_date: '',
        cep: '',
        city: {
          id: '',
          name: ''
        },
        cpf: '',
        email: '',
        id: '',
        name: '',
        neighborhood: '',
        note: '',
        pcd: '',
        phone1: '',
        phone2: '',
        responsible_id: '',
        rg: '',
        state: {
          abbreviation: '',
          id: '',
          name: ''
        }
      }
    }
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `citizens/${this.props.user.citizen.id}/service_types/${this.props.params.service_type_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ service_type: resp.citizen })
    });
  }

  mainComponent() {
    return (
      <div className='card'>
            <div className='card-content'>
              <h2 className='card-title h2-title-home'> Informações do Dependente: </h2>
              <p> 
                <b>Nome: </b>
                {this.state.service_type.name}
              </p>
              <p> 
                <b>CPF: </b>
                {this.state.service_type.cpf}
              </p>
              <p> 
                <b>RG: </b>
                {this.state.service_type.rg}
              </p>
              <p> 
                <b>Data de Nascimento: </b>
                {this.state.service_type.birth_date}
              </p>
              <p> 
                <b>Telefone 1: </b>
                {this.state.service_type.phone1}
              </p>
              <p> 
                <b>Telefone 2: </b>
                {this.state.service_type.phone2}
              </p>
              <p> 
                <b>E-mail: </b>
                {this.state.service_type.email}
              </p>
              <p> 
                <b>CEP: </b>
                {this.state.service_type.cep}
              </p>
              <p> 
                <b>Estado: </b>
                {this.state.service_type.state.name}
              </p>
              <p> 
                <b>Município: </b>
                {this.state.service_type.city.name}
              </p>
              <p> 
                <b>Bairro: </b>
                {this.state.service_type.address.neighborhood}
              </p>
              <p> 
                <b>Endereço: </b>
                {this.state.service_type.address.address}
              </p>
              <p> 
                <b>Complemento do endereço: </b>
                {this.state.service_type.address.complement}
              </p>
              <p> 
                <b>Observações: </b>
                {this.state.service_type.note}
              </p>
            </div>
            {this.editButton()}
        </div>
    )
  }

  editServiceType () {
    browserHistory.push(`service_types/${this.props.params.service_type_id}/edit`)
  }

  prev() {
    browserHistory.push(`service_types`)
  }  

	editButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
				<button className="waves-effect btn right" name="commit" onClick={this.editServiceType.bind(this)} type="submit">Editar</button>
      </div>
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
const ServiceTypeShow = connect(
  mapStateToProps
)(getServiceTypeShow)
export default ServiceTypeShow
