import React, {Component} from 'react'
import { Link } from 'react-router'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/UserForm.css'
import 'react-day-picker/lib/style.css'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import { UserImg } from '../images';
import MaskedInput from 'react-maskedinput';
import update from 'react-addons-update';
import InputMask from 'react-input-mask';

class getUserForm extends Component {

 constructor(props) {
    super(props)
    this.state = {
      user: { 
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
        birth_day: 0,
        birth_month: 0,
        birth_year: 0,
        birth_year_id: 0,
      },
      city_name: '',
      state_abbreviation: '',
      check: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.state.check = false || this.state.user.pcd;
  }

  componentWillMount() {
    var self = this;
    if(this.props.is_edit) {
      var year = parseInt(this.props.user_data.birth_date.substring(0,4))
      self.setState({
        city_name: this.props.user_data.city.name,
        state_abbreviation: this.props.user_data.state.abbreviation,
        user: update(this.props.user_data, 
        { 
          birth_day: {$set:  parseInt(this.props.user_data.birth_date.substring(8,10))},
          birth_month: {$set:  parseInt(this.props.user_data.birth_date.substring(5,7))},
          birth_year: {$set: year},
          birth_year_id: {$set: year-1899}
        })
      })
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      user: update(this.state.user, { [name]: {$set: value} })
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
          <Input s={12} l={3} 
            type='select'
            name='birth_day'
            value={this.state.user.birth_day}
            onChange={this.handleInputChange.bind(this)}
          >
            {optionsDays}
          </Input>

          <Input s={12} l={4} 
            type='select'
            name='birth_month'
            value={this.state.user.birth_month}
            onChange={this.handleInputChange.bind(this)}
          >
            {optionsMonths}
          </Input>

          <Input s={12} l={4} 
            type='select'
            name='birth_year_id'
            value={this.state.user.birth_year_id}
            onChange={ (event) => {
                this.handleInputChange.bind(this)(event) 
                this.setState({
                  user: update(this.state.user, 
                  { 
                    birth_year: {$set: parseInt(this.state.user.birth_year_id)+parseInt(1899)}
                  })
                })
              }
            }
          >
            {optionsYears}
          </Input>
        </div>
      )
  }

  updateAddress(cep) {
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = 'validate_cep';
    const params = `permission=${this.props.user.current_role}`
    var formData = {};
    formData["cep"] = {};
    formData["cep"]["number"] = cep;
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
      method: "post",
      body: JSON.stringify(formData)
    }).then(parseResponse).then(resp => {
      this.setState({ user: update(this.state.user, {address: {$set: resp}})})
      this.setState({ city_name: resp.city_name, state_abbreviation: resp.state_name })
    }).catch(() => {
      Materialize.toast('CEP inválido.', 10000, "red",function(){$("#toast-container").remove()});
    })
  }


  handleSubmit() {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", 
      "Oct", "Nov", "Dec"
    ];

    let errors = [];
    let formData = {};
    formData = this.state.user;
    if(this.props.user_class == `citizen` && !formData['cpf'])
      errors.push("Campo CPF é obrigatório.");
    if(!formData['birth_day'] || !formData['birth_month'] || !formData['birth_year'])
      errors.push("Campo Data de Nascimento é obrigatório.");
    if(!formData['cep'])
      errors.push("Campo CEP é obrigatório.");
    if(errors.length > 0) {
      let full_error_msg = "";
      errors.forEach(function(elem){ full_error_msg += elem + '\n' });
      Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
    } else {
      formData['cpf'] = formData['cpf'].replace(/(\.|-)/g,'');
      formData['cep'] = formData['cep'].replace(/(\.|-)/g,'');
      formData['rg'] = formData['rg'].replace(/(\.|-)/g,'');
      formData['birth_date'] = `${monthNames[formData['birth_month']-1]} ${formData['birth_day']} ${formData['birth_year']}`
      console.log(formData['birth_date'])
      var { birth_day, birth_month, birth_year, birth_year_id, address, ...other } = formData;

      let fetch_body = {};
      if(this.props.user_class == `dependant`) {
        fetch_body['dependant'] = formData;
      } else {
        fetch_body = formData;
      }

      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = this.props.collection;
      const params = `permission=${this.props.user.current_role}`
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
        method: this.props.fetch_method,
        body: JSON.stringify(fetch_body)
      }).then(parseResponse).then(resp => {
        browserHistory.push(this.props.submit_url)
      }); 
    }
  }

  handleChange(event){
    this.setState({check: event.target.value})
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
                        <input type="text" name="name" className='input-field' value={this.state.user.name} onChange={this.handleInputChange.bind(this)} />
                      </label>
                    </div>
                    <div className="field-input" >
                      <h6>Data de nascimento*:</h6>
                      {this.selectDate()}
                    </div>

                    <div className="field-input" >
                      <h6>Possui algum tipo de deficiência:</h6>
                      <div className="check-input">
                        <Input 
                          onChange={this.handleChange} 
                          checked={this.state.check} 
                          s={12} l={12} 
                          name='group1' 
                          type='radio' 
                          value='true' 
                          label='Sim' 
                        />
                        <Input 
                          onChange={this.handleChange} 
                          checked={!this.state.check} 
                          s={12} l={12} 
                          name='group1' 
                          type='radio' 
                          value='' 
                          label='Não' 
                        />

                        { this.state.check ? 
                          <div>
                            <h6>Qual tipo de deficiência:</h6>
                            <label>
                              <input 
                                type="text" 
                                className='input-field' 
                                name="cpf" value="" 
                                onChange={this.handleInputChange.bind(this)}
                                />
                            </label>
                          </div> 
                          : null 
                        }
                      </div>
                    </div>

                    <div className="field-input">
                      <h6>CPF:</h6>
                      <label>
                        <MaskedInput 
                          type="text" 
                          className='input-field' 
                          mask="111.111.111-11" 
                          name="cpf" 
                          value={this.state.user.cpf} 
                          onChange={this.handleInputChange.bind(this)} 
                        />
                      </label>
                    </div>
                    
                    <div className="field-input">
                      <h6>RG:</h6>
                      <label>
                        <MaskedInput 
                          type="text" 
                          className='input-field' 
                          mask="11.111.111-1" 
                          name="rg" 
                          value={this.state.user.rg} 
                          onChange={this.handleInputChange.bind(this)} 
                        />
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
                        <MaskedInput 
                          type="text" 
                          className='input-field' 
                          mask="11111-111" name="cep" 
                          value={this.state.user.cep} 
                          onChange=
                          {
                            (event) => {
                              this.handleInputChange.bind(this)(event)
                              var cep = event.target.value.replace(/(\.|-|_)/g,'')
                              if(cep.length == 8)
                                this.updateAddress.bind(this)(cep) 
                            }
                          } 
                        />
                      </label>
                    </div>

                    <div className="field-input" >
                      <h6>Estado do endereço:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="address_state" 
                          value={this.state.state_abbreviation}  
                          disabled />
                      </label>
                    </div>

                    <div className="field-input" >
                      <h6>Munícipio:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="city" 
                          value={this.state.city_name}  
                          disabled 
                        />
                      </label>
                    </div>
                    <div className="field-input" >
                      <h6>Bairro:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="address_neighborhood" 
                          value={this.state.user.address.neighborhood} 
                        />
                      </label>
                    </div>

                    <div className="field-input" >
                      <h6>Endereço:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="address_street" 
                          value={this.state.user.address.address} 
                        />
                      </label>
                    </div>
                    
                    <div className="field-input" >
                      <h6>Número:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="address_number" 
                          value={this.state.user.address_number} 
                          onChange={this.handleInputChange.bind(this)} 
                        />
                      </label>
                    </div>

                    <div className="field-input" >
                      <h6>Complemento:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="address_complement" 
                          value={this.state.user.address_complement} 
                          onChange={this.handleInputChange.bind(this)} />
                      </label>
                    </div>
                    </Col>
                </Row>
                <Row className='first-line'>
                  <Col s={12} m={12} l={6}>

                    <div className='category-title'>
                      <p>Informações de Contato</p>
                    </div>

                    <div className="field-input">
                      <h6>Telefone 1:</h6>
                      <label>
                        <InputMask
                          mask="(99) 9999 - 9999 9"
                          maskChar=" "                      
                          type="text" 
                          className='input-field' 
                          name="phone1" 
                          value={this.state.user.phone1} 
                          onChange={this.handleInputChange.bind(this)} 
                        />
                      </label>
                    </div>

                    <div className="field-input">
                      <h6>Telefone 2:</h6>
                      <label>
                        <InputMask
                          mask="(99) 9999 - 9999 9" 
                          maskChar=" "
                          type="text" 
                          className='input-field' 
                          name="phone2" 
                          value={this.state.user.phone2} 
                          onChange={this.handleInputChange.bind(this)} 
                        />
                      </label>
                    </div>

                    <div className="field-input">
                      <h6>E-mail:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="email" 
                          value={this.state.user.email} 
                          onChange={this.handleInputChange.bind(this)} 
                        />
                      </label>
                    </div>

                    <div>
                      <h6>Observações:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="note" 
                          value={this.state.user.note} 
                          onChange={this.handleInputChange.bind(this)} 
                        />
                      </label>
                    </div>
                    </Col>

                    {this.props.user_class == `citizen` ?
                      <Col s={12} m={12} l={6}>

                        <div className='category-title'>
                          <p>Senha</p>
                        </div>

                        <div className="field-input">
                          <h6>Senha atual:</h6>
                          <label>
                            <input 
                              type="text" 
                              className='input-field' 
                              name="senha" 
                              value="" 
                              onChange={this.handleInputChange.bind(this)} 
                            />
                          </label>
                        </div>
                        
                        <div className="field-input">
                          <h6>Nova senha: <i>(mínimo 6 caracteres)</i></h6>
                          <label>
                            <input 
                              type="text" 
                              className='input-field' 
                              name="senha" 
                              value="" 
                              onChange={this.handleInputChange.bind(this)} 
                            />
                          </label>
                        </div>

                        <div className="field-input">
                          <h6>Confirmação de senha:</h6>
                          <label>
                            <input 
                              type="text" 
                              className='input-field' 
                              name="senha2" 
                              value="" 
                              onChange={this.handleInputChange.bind(this)} 
                            />
                          </label>
                        </div>
                        <p><font color="red"> Campos com (*) são de preenchimento obrigatório.</font></p>
                      </Col> : null
                    } 


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
const UserForm = connect(
  mapStateToProps
)(getUserForm)
export default UserForm
