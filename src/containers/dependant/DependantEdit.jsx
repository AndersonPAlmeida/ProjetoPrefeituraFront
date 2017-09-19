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
import { UserImg } from '../images';
import { Input as S_Input } from "./../../redux-auth/views/default/Input"; 
import update from 'react-addons-update';

class getDependantEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      update_address: 0,
      dependant: { 
        address: {
          address: '',
          neighborhood: '',
          zipcode: ''
        },
        address_complement: '',
        address_number: '',
        birth_date: '',
        cep: '',
        cpf: '',
        email: '',
        name: '',
        note: '',
        pcd: '',
        phone1: '',
        phone2: '',
        rg: '',
      },
      city_name: '',
      state_abbreviation: '',
      check: false
    };
    this.handleChange = this.handleChange.bind(this);
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
      self.setState({ dependant: resp.citizen, city_name: resp.citizen.city.name, state_abbreviation: resp.citizen.state.abbreviation })
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      dependant: update(this.state.dependant, { [name]: {$set: value} })
    })
  }

  selectDate(){ 
      var optionsDays = []; 
      optionsDays.push(<option key={0} value="" disabled>Dia</option>);
      for(var i = 1; i <= 31; i++){
        optionsDays.push(
          <option key={i} value={i}>{i}</option>
        );
      }
      var optionsMonths = []
      optionsMonths.push(<option key={0} value="" disabled>Mês</option>);
      var months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      for(var i = 0; i < 12; i++){
        optionsMonths.push(
          <option key={i+1} value={i+1}>{months[i]}</option>
        );
      }
      var optionsYears = []
      optionsYears.push(<option key={0} value="" disabled>Ano</option>);
      var year = new Date().getFullYear()
      for(var i = 1900; i < year; i++){
        optionsYears.push(
          <option key={i-1899} value={i-1899}>{i}</option>
        );
      }
      return (
            <div>
              <Input s={12} l={3} type='select'
              >
                {optionsDays}
              </Input>
            
              <Input s={12} l={4} type='select'
                materializeComp={true}
              >
                {optionsMonths}
              </Input>

              <Input s={12} l={4} type='select'
                materializeComp={true}
              >
                {optionsYears}
              </Input>

            </div>
              )
  }

  updateAddress() {
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'validate_cep';
    const params = `permission=${this.props.user.current_role}`
    var formData = {};
    formData["cep"] = {};
    formData["cep"]["number"] = this.state.dependant.cep.replace(/(\.|-)/g,'');
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
      method: "post",
      body: JSON.stringify(formData)
    }).then(parseResponse).then(resp => {
      this.setState({ dependant: update(this.state.dependant, {address: {$set: resp}})})
      this.setState({ city_name: resp.city_name, state_abbreviation: resp.state_name })
      this.setState({ update_address: 0 })
    }); 
  }


  handleSubmit() {
    this.updateAddress.bind(this)() 
    //browserHistory.push(`/dependants`)
  }

  handleChange(event){
    this.setState({check: event.target.value})
  }

  prev() {
    browserHistory.push(`/dependants`)
  }

	confirmButton() {
		return (
			<div className="card-action">
				<a className='back-bt waves-effect btn-flat' href='#' onClick={this.prev}> Voltar </a>
				<button className="waves-effect btn right button-color" onClick={this.handleSubmit.bind(this)} name="commit" type="submit">Atualizar</button>
      </div>
		)
	}

  render() {
    return (
      <main>
      	<Row>
	        <Col s={12}>
            <div className='card'>
              <div className='card-content'>
                <h2 className="card-title">Alterar dependente: Dependente C</h2>

                <Row className='first-line'>
                  <Col s={12} m={12} l={6}>
                    <div>
                        <img
                          src={UserImg} />
                        <div className='file-input'>
                          <Input type='file'
                          />
                        </div>
                    </div>
                    <div className="field-input" >
                      <h6>Nome*:</h6>
                      <label>
                        <input type="text" name="name" className='input-field' value={this.state.dependant.name} onChange={this.handleInputChange.bind(this)} />
                      </label>
                    </div>
                    <div className="field-input" >
                      <h6>Data de nascimento*:</h6>
                      {this.selectDate()}
                    </div>
                    <div className="field-input" >
                      <h6>Possui algum tipo de deficiência:</h6>
                      <div className="check-input">
                        <Input onChange={this.handleChange} s={12} l={12} name='group1' type='radio' value='true' label='Sim' />
                        <Input onChange={this.handleChange} defaultChecked='true' s={12} l={12} name='group1' type='radio' value='' label='Não' />
                        { this.state.check ? <div>
                                              <h6>Qual tipo de deficiência:</h6>
                                              <label>
                                                <input type="text" className='input-field' name="cpf" value="" onChange={this.handleInputChange.bind(this)} />
                                              </label>
                                            </div> : null }
                      </div>
                    </div>
                    <div className="field-input">
                      <h6>CPF:</h6>
                      <label>
                        <input type="text" className='input-field' name="cpf" value={this.state.dependant.cpf} onChange={this.handleInputChange.bind(this)} />
                      </label>
                    </div>
                    <div className="field-input">
                      <h6>RG:</h6>
                      <label>
                        <input type="text" className='input-field' name="rg" value={this.state.dependant.rg} onChange={this.handleInputChange.bind(this)} />
                      </label>
                    </div>
                  </Col>
                  <Col s={12} m={12} l={6}>
                    <div className='category-title'>
                      <p>Endereço</p>
                    </div>
                    <div className="field-input" >
                      <h6>CEP:</h6>
                      <label>
                        <input type="text" className='input-field' name="cep" value={this.state.dependant.cep} onChange={this.handleInputChange.bind(this)} />
                      </label>
                    </div>
                    <div className="field-input" >
                      <h6>Estado do endereço:</h6>
                      <label>
                        <input type="text" className='input-field' name="address_state" value={this.state.state_abbreviation} />
                      </label>
                    </div>
                    <div className="field-input" >
                      <h6>Munícipio:</h6>
                      <label>
                        <input type="text" className='input-field' name="city" value={this.state.city_name} />
                      </label>
                    </div>
                    <div className="field-input" >
                      <h6>Bairro:</h6>
                      <label>
                        <input type="text" className='input-field' name="address_neighborhood" value={this.state.dependant.address.neighborhood} />
                      </label>
                    </div>
                    <div className="field-input" >
                      <h6>Endereço:</h6>
                      <label>
                        <input type="text" className='input-field' name="address_street" value={this.state.dependant.address.address} />
                      </label>
                    </div>
                    <div className="field-input" >
                      <h6>Número:</h6>
                      <label>
                        <input type="text" className='input-field' name="address_number" value={this.state.dependant.address_number} onChange={this.handleInputChange.bind(this)} />
                      </label>
                    </div>
                    <div className="field-input" >
                      <h6>Complemento:</h6>
                      <label>
                        <input type="text" className='input-field' name="address_complement" value={this.state.dependant.address_complement} onChange={this.handleInputChange.bind(this)} />
                      </label>
                    </div>
                    <div className='category-title'>
                      <p>Informações de Contato</p>
                    </div>
                    <div className="field-input">
                      <h6>Telefone 1:</h6>
                      <label>
                        <input type="text" className='input-field' name="phone1" value={this.state.dependant.phone1} onChange={this.handleInputChange.bind(this)} />
                      </label>
                    </div>
                    <div className="field-input">
                      <h6>Telefone 2:</h6>
                      <label>
                        <input type="text" className='input-field' name="phone2" value={this.state.dependant.phone2} onChange={this.handleInputChange.bind(this)} />
                      </label>
                    </div>
                    <div className="field-input">
                      <h6>E-mail:</h6>
                      <label>
                        <input type="text" className='input-field' name="email" value={this.state.dependant.email} onChange={this.handleInputChange.bind(this)} />
                      </label>
                    </div>
                    <div>
                      <h6>Observações:</h6>
                      <label>
                        <input type="text" className='input-field' name="note" value={this.state.dependant.note} onChange={this.handleInputChange.bind(this)} />
                      </label>
                  </div></
                  Col>
                </Row>
                {this.confirmButton()}
              </div>
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
