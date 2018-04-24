import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ProfessionalUserDependantShow.css'
import { port, apiHost, apiPort, apiVer } from '../../../../config/env';
import {parseResponse} from "../../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import { UserImg } from '../../images';

class getProfessionalUserDependantShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dependant: {
        address: {},
        city: {},
        state: {}
      },
      photo: null
    }
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `${apiHost}:${apiPort}/${apiVer}`;
    var collection = `citizens/${this.props.params.citizen_id}/dependants/${this.props.params.dependant_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ dependant: resp.citizen }, () => {
          collection = `citizens/${this.state.dependant.id}/picture`
          fetch(`${apiUrl}/${collection}?${params}`, {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            method: "get"
          })
            .then(resp => {
              var contentType = resp.headers.get("content-type");
              if(resp.status == 200 && contentType && contentType.indexOf("image") !== -1) {
                resp.blob().then(photo => {
                  self.setState({ photo: URL.createObjectURL(photo)});
                })
              } else {
                self.setState({ photo: UserImg });
              }
          }).catch(e => {})
        }
      )
    });
  }

  mainComponent() {
    return (
      <div className='card'>
        <div className='card-content'>
          <h2 className='card-title h2-title-home'> Informações do Dependente: </h2>
          <img
            id='user_photo'
            width='230'
            height='230'
            src={this.state.photo}
          />
          <p>
            <b>Nome: </b>
            {this.state.dependant.name}
          </p>
          <p>
            <b>CPF: </b>
            {this.state.dependant.cpf}
          </p>
          <p>
            <b>RG: </b>
            {this.state.dependant.rg}
          </p>
          <p>
            <b>Data de Nascimento: </b>
            {this.state.dependant.birth_date}
          </p>
          <p>
            <b>Telefone 1: </b>
            {this.state.dependant.phone1}
          </p>
          <p>
            <b>Telefone 2: </b>
            {this.state.dependant.phone2}
          </p>
          <p>
            <b>E-mail: </b>
            {this.state.dependant.email}
          </p>
          <p>
            <b>CEP: </b>
            {this.state.dependant.cep}
          </p>
          <p>
            <b>Estado: </b>
            {this.state.dependant.state.name}
          </p>
          <p>
            <b>Município: </b>
            {this.state.dependant.city.name}
          </p>
          <p>
            <b>Bairro: </b>
            {this.state.dependant.address.neighborhood}
          </p>
          <p>
            <b>Endereço: </b>
            {this.state.dependant.address.address}
          </p>
          <p>
            <b>Complemento do endereço: </b>
            {this.state.dependant.address.complement}
          </p>
          <p> 
            <b>Observações: </b>
            {this.state.dependant.note}
          </p>
        </div>
        {this.editButton()}
      </div>
    )
  }

  editDependant () {
    browserHistory.push(`professionals/users/${this.props.params.citizen_id}/dependants/${this.props.params.dependant_id}/edit`)
  }

  prev() {
    browserHistory.push(`professionals/users/${this.props.params.citizen_id}`)
  }  

	editButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' onClick={this.prev.bind(this)} > Voltar </a>
				<button className="waves-effect btn right" name="commit" onClick={this.editDependant.bind(this)} type="submit">Editar</button>
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
const ProfessionalUserDependantShow = connect(
  mapStateToProps
)(getProfessionalUserDependantShow)
export default ProfessionalUserDependantShow
