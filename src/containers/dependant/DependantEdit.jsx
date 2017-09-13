import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/DependantEdit.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';

class getDependantEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      update_address: 0,
      dependant: { 
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
    const collection = `citizens/${this.props.user.citizen.id}/dependants/${this.props.params.dependant_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ dependant: resp.citizen })
    });
  }

  componentDidUpdate() {
    if(this.state.update_address != 0) { 
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = 'validate_cep';
      const params = `permission=${this.props.user.current_role}`
      var formData = {};
      formData["cep"] = {};
      formData["cep"]["number"] = this.state.cep.replace(/(\.|-)/g,'');
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
        method: "body",
        body: JSON.stringify(formData)
      }).then(parseResponse).then(resp => {
        this.setState({ address: resp })
        this.setState({ update_address: 0 })
      }); 
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      dependant: update(this.state.dependant, {name: {$set: value}})
    })
  }


  handleSubmit() {
    browserHistory.push(`/dependants`)
  }

  prev() {
    browserHistory.push(`/dependants`)
  }

	confirmButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' href='#' onClick={this.prev}> Voltar </a>
				<button className="waves-effect btn right" onClick={this.handleSubmit.bind(this)} name="commit" type="submit">Continuar</button>
      </div>
		)
	}

  render() {
    return (
      <main>
      	<Row>
	        <Col s={12}>
		      	<div>
              <label>
                Nome:
                <input type="text" name="name" value={this.state.dependant.name} onChange={this.handleInputChange} />
              </label>
              <label>
                CEP:
                <input type="text" name="cep" value={this.state.dependant.cep} onChange={this.handleInputChange} />
              </label>
              <label>
                CPF:
                <input type="text" name="cpf" value={this.state.dependant.cpf} onChange={this.handleInputChange} />
              </label>
              <label>
                Email:
                <input type="text" name="email" value={this.state.dependant.email} onChange={this.handleInputChange} />
              </label>
              <label>
                RG:
                <input type="text" name="rg" value={this.state.dependant.rg} onChange={this.handleInputChange} />
              </label>
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
const DependantEdit = connect(
  mapStateToProps
)(getDependantEdit)
export default DependantEdit
