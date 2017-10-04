import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/SectorForm.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import { SectorImg } from '../images';
import MaskedInput from 'react-maskedinput';
import update from 'react-addons-update';

class getSectorForm extends Component {

 constructor(props) {
    super(props)
    this.state = {
      sector: { 
        active: '',
        absence_max: '',
        blocking_days: '',
        cancel_limt: '',
        description: '',
        name: '',
        previous_notice: '',
        schedules_by_sector: '' 
      },
    };
  }

  componentWillMount() {
    var self = this;
    if(this.props.is_edit) {
      self.setState({ sector: this.props.data })
    }
  }

  handleInputSectorChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      sector: update(this.state.sector, { [name]: {$set: value} })
    })
  }

  handleSubmit() {
    let errors = [];
    let formData = {};
    formData = this.state.sector;

    if(!formData['name'])
      errors.push("Campo Nome é obrigatório.");
    if(errors.length > 0) {
      let full_error_msg = "";
      errors.forEach(function(elem){ full_error_msg += elem + '\n' });
      Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
    } else {
      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = this.props.fetch_collection;
      const params = this.props.fetch_params; 
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
        method: this.props.fetch_method,
        body: JSON.stringify(formData)
      }).then(parseResponse).then(resp => {
        Materialize.toast('Cadastro efetuado com sucesso.', 10000, "green",function(){$("#toast-container").remove()});
        browserHistory.push(this.props.submit_url)
      }).catch(({errors}) => {
        if(errors) {
          let full_error_msg = "";
          errors['full_messages'].forEach(function(elem){ full_error_msg += elem + '\n' });
          Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
          throw errors;
        }
      });
    }
  }

  confirmButton() {
    return (
      <div className="card-action">
        <a className='back-bt waves-effect btn-flat' href='#' onClick={this.props.prev}> Voltar </a>
        <button className="waves-effect btn right button-color" onClick={this.handleSubmit.bind(this)} name="commit" type="submit">{this.props.is_edit ? "Atualizar" : "Criar"}</button>
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
                {this.props.is_edit ?
                  <h2 className="card-title">Alterar setor: {this.props.data.name}</h2> 
                  :
                  <h2 className="card-title">Cadastrar setor</h2> 
                }
                <Row className='first-line'>
                  <Col s={12} m={12} l={6}>
                    <div className="field-input" >
                      <h6>Situação:</h6>
                      <label>
                        <Input s={12} l={3} 
                               type='select'
                               name='birth_day'
                               value={this.state.sector.active}
                               onChange={this.handleInputSectorChange.bind(this)} 
                        >
                          <option key={0} value={true}>Ativo</option>
                          <option key={1} value={false}>Inativo</option>
                        </Input>
                      </label>
                    </div>
                    <div className="field-input" >
                      <h6>Nome:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="name" 
                          value={this.state.sector.name} 
                          onChange={this.handleInputSectorChange.bind(this)} 
                        />
                      </label>
                    </div>
                    <div className="field-input" >
                      <h6>Número de agendamentos por setor:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="schedules_by_sector" 
                          value={this.state.sector.schedules_by_sector} 
                          onChange={this.handleInputSectorChange.bind(this)} 
                        />
                      </label>
                    </div>
                    <div className="field-input" >
                      <h6>Número de dias de impedimento de novos agendamentos:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="blocking_days" 
                          value={this.state.sector.blocking_days} 
                          onChange={this.handleInputSectorChange.bind(this)} 
                        />
                      </label>
                    </div>
                    <div className="field-input" >
                      <h6>Limite de cancelamentos:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="cancel_limit" 
                          value={this.state.sector.cancel_limit} 
                          onChange={this.handleInputSectorChange.bind(this)} 
                        />
                      </label>
                    </div>
                    <div className="field-input" >
                      <h6>Horas de antecedências para poder cancelar um atendimento:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="previous_notice" 
                          value={this.state.sector.previous_notice} 
                          onChange={this.handleInputSectorChange.bind(this)} 
                        />
                      </label>
                    </div>
                    <div className="field-input" >
                      <h6>Número de faltas que gera impedimento de novos agendamentos:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="absence_max" 
                          value={this.state.sector.absence_max} 
                          onChange={this.handleInputSectorChange.bind(this)} 
                        />
                      </label>
                    </div>
                    <div>
                      <h6>Descrição:</h6>
                      <label>
                        <textarea  
                          className='input-field materialize-textarea'
                          name="description" 
                          value={this.state.sector.description} 
                          onChange={this.handleInputUserChange.bind(this)} 
                        />
                      </label>
                    </div>
                    <p><font color="red"> Campos com (*) são de preenchimento obrigatório.</font></p>
                  </Col>
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

const SectorForm = connect()(getSectorForm)
export default SectorForm
