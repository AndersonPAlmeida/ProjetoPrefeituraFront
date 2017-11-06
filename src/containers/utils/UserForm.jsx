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
import {userSignIn} from '../../actions/user';

class getUserForm extends Component {

 constructor(props) {
    super(props)
    this.state = {
      user: { 
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
        rg: ''
      },
      aux: {
        address: '',
        birth_day: '',
        birth_month: '',
        birth_year: '',
        birth_year_id: '',
        city_name: '',
        neighborhood: '',
        photo: '',
        photo_obj: '',
        photo_has_changed: 0,
        password: "",
        current_password: "",
        password_confirmation: "",
        state_abbreviation: '',
        phonemask: "(11) 1111-11111"
      },
    };
  }

  componentWillMount() {
    var self = this;
    if(this.props.is_edit) {
      var img;
      if(!this.props.photo)
        img = UserImg
      else
        img = this.props.photo
      var year = parseInt(this.props.user_data.birth_date.substring(0,4))
      self.setState({
        user: this.props.user_data,
        aux: update(this.state.aux, 
        {
          birth_day: {$set: parseInt(this.props.user_data.birth_date.substring(8,10))},
          birth_month: {$set: parseInt(this.props.user_data.birth_date.substring(5,7))},
          birth_year: {$set: year},
          birth_year_id: {$set: year-1899},
          photo_obj: {$set: img}
        })
      })
      this.updateAddress.bind(this)(this.props.user_data.cep.replace(/(\.|-|_)/g,'')) 
        
    }
    else {
      if(location.search) {
        var search = location.search.substring(1);
        var query = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
        self.setState({
          user: update(this.state.user, { cep: {$set: query['cep']} })
        })
        this.updateAddress.bind(this)(query['cep'].replace(/(\.|-|_)/g,'')) 
      }
    }
  }

  handleInputUserChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      user: update(this.state.user, { [name]: {$set: value} })
    })
  }

  handleChange(event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      aux: update(this.state.aux, { [name]: {$set: value} })
    })
  }

  handleFile(event) {
    const target = event.target;
    const name = target.name;
    var value = target.files[0];
    var reader = new FileReader();

    const onLoad = function(e) {
      var dataURL = reader.result;
      this.setState({
        aux: update(
          this.state.aux, { 
                            [name]: {$set: value.name}, 
                            photo_obj: {$set: dataURL},
                            photo_has_changed: {$set: 1}
                          }
        )
      })
    };
    reader.onload = onLoad.bind(this)
    reader.readAsDataURL(value)
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
            value={this.state.aux.birth_day}
            onChange={this.handleChange.bind(this)}
          >
            {optionsDays}
          </Input>

          <Input s={12} l={4} 
            type='select'
            name='birth_month'
            value={this.state.aux.birth_month}
            onChange={this.handleChange.bind(this)}
          >
            {optionsMonths}
          </Input>

          <Input s={12} l={4} 
            type='select'
            name='birth_year_id'
            value={this.state.aux.birth_year_id}
            onChange={ (event) => {
                this.handleChange.bind(this)(event) 
                this.setState({aux: update(this.state.aux, 
                  {
                    birth_year: {$set: parseInt(this.state.aux.birth_year_id)+parseInt(1899)},
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
    var formData = {};
    formData["cep"] = {};
    formData["cep"]["number"] = cep;
    fetch(`${apiUrl}/${collection}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
      method: "post",
      body: JSON.stringify(formData)
    }).then(parseResponse).then(resp => {
      this.setState(
      { aux: update(this.state.aux, 
        {
          address: {$set: resp.address},
          neighborhood: {$set: resp.neighborhood},
          city_name: {$set: resp.city_name}, 
          state_abbreviation: {$set: resp.state_name}
        })
      });
    }).catch(() => {
      Materialize.toast('CEP inválido.', 10000, "red",function(){$("#toast-container").remove()});
    })
  }

  handleSubmit() {
    const monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", 
      "Oct", "Nov", "Dec"
    ];
    let errors = [];
    let formData = {};
    let auxData = {};
    var image = {};
    var send_password = false;
    formData = this.state.user;
    auxData = this.state.aux;

    if(!auxData['birth_day'] || !auxData['birth_month'] || !auxData['birth_year'])
      errors.push("Campo Data de Nascimento é obrigatório.");
    if(!formData['cep'])
      errors.push("Campo CEP é obrigatório.");
    if(this.props.user_class == `citizen`) {
      if(!formData['cpf'])
        errors.push("Campo CPF é obrigatório.");
      else
        formData['cpf'] = formData['cpf'].replace(/(\.|-)/g,'');
      if(!this.props.is_edit || auxData['password']) {
        send_password = true;
        if(!auxData['password'])
          errors.push("Campo Senha é obrigatório.");
        if(!auxData['password'])
          errors.push("Campo Confirmação de Senha é obrigatório..");
        if(auxData['password_confirmation'] != auxData['password'])
          errors.push("A senha de confirmação não corresponde a senha atual.");
      }
    }
    if(errors.length > 0) {
      let full_error_msg = "";
      errors.forEach(function(elem){ full_error_msg += elem + '\n' });
      Materialize.toast(full_error_msg, 10000, "red",function(){$("#toast-container").remove()});
    } else {
      formData['cep'] = formData['cep'].replace(/(\.|-)/g,'');
      formData['rg'] = formData['rg'].replace(/(\.|-)/g,'');
      formData['birth_date'] = `${monthNames[auxData['birth_month']-1]} ${auxData['birth_day']} ${auxData['birth_year']}`
      let fetch_body = {};
      if(this.props.user_class == `dependant`) {
        fetch_body['dependant'] = formData;
      } else {
        if(this.props.is_edit)
          fetch_body['citizen'] = formData;
        else
          fetch_body = formData;
        if(send_password) {
          fetch_body['password'] = auxData['password'] 
          fetch_body['password_confirmation'] = auxData['password_confirmation'] 
          if(auxData['current_password'])
            fetch_body['current_password'] = auxData['current_password'] 
        }
      }

      if(this.state.aux.photo_has_changed) {
        image['content'] = this.state.aux.photo_obj.split(',')[1];
        image['content_type'] = this.state.aux.photo_obj.slice(5,14);
        image['filename'] = this.state.aux.photo;
        fetch_body['image'] = image;
      }

      const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
      const collection = this.props.fetch_collection;
      const params = this.props.fetch_params; 
      fetch(`${apiUrl}/${collection}?${params}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json" },
        method: this.props.fetch_method,
        body: JSON.stringify(fetch_body)
      }).then(parseResponse).then(resp => {
        if(this.props.is_edit && this.props.user_class == `citizen`)
          this.props.dispatch(userSignIn(resp.data))
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
                this.props.user_class == `citizen` ?
                  <h2 className="card-title">Alterar cadastro: {this.props.user_data.name}</h2>
                  :
                  <h2 className="card-title">Alterar dependente: {this.props.user_data.name}</h2> 
                  :
                  this.props.user_class == `citizen` ?
                    <h2 className="card-title">Cadastrar cidadão</h2>
                    :
                    <h2 className="card-title">Cadastrar dependente</h2> 
              }

                <Row className='first-line'>
                  <Col s={12} m={12} l={6}>
                    <div>
                        <img
                          id='user_photo'
                          width='230'
                          height='230'
                          src={this.state.aux.photo_obj}
                        />
                        <div className='file-input'>
                          <Input 
                            type='file'
                            name='photo'
                            accept='image/*'
                            onChange={this.handleFile.bind(this)} 
                          />
                        </div>
                    </div>
                    <div className="field-input" >
                      <h6>Nome*:</h6>
                      <label>
                        <input type="text" name="name" className='input-field' value={this.state.user.name} onChange={this.handleInputUserChange.bind(this)} />
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
                          onChange={this.handleUserInputChange} 
                          checked={this.state.user.pcd} 
                          s={12} l={12} 
                          name='pcd' 
                          type='radio' 
                          value='true' 
                          label='Sim' 
                        />
                        <Input 
                          onChange={this.handleUserInputChange} 
                          checked={!this.state.user.pcd} 
                          s={12} l={12} 
                          name='pcd' 
                          type='radio' 
                          value='' 
                          label='Não' 
                        />

                        { this.state.user.pcd ? 
                          <div>
                            <h6>Qual tipo de deficiência:</h6>
                            <label>
                              <input 
                                type="text" 
                                className='input-field' 
                                name="pcd_description" value="" 
                                onChange={this.handleInputUserChange.bind(this)}
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
                          onChange={this.handleInputUserChange.bind(this)} 
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
                          onChange={this.handleInputUserChange.bind(this)} 
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
                              this.handleInputUserChange.bind(this)(event)
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
                          name="state_abbreviation" 
                          value={this.state.aux.state_abbreviation}  
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
                          value={this.state.aux.city_name}  
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
                          name="neighborhood" 
                          value={this.state.aux.neighborhood} 
                        />
                      </label>
                    </div>

                    <div className="field-input" >
                      <h6>Endereço:</h6>
                      <label>
                        <input 
                          type="text" 
                          className='input-field' 
                          name="address" 
                          value={this.state.aux.address} 
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
                          onChange={this.handleInputUserChange.bind(this)} 
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
                          onChange={this.handleInputUserChange.bind(this)} />
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
                        <MaskedInput
                          mask={this.state.aux.phonemask}
                          type="text" 
                          className='input-field' 
                          name="phone1" 
                          value={this.state.user.phone1} 
                          onChange={
                            (event) => {
                              this.handleInputUserChange.bind(this)(event)
                              if(event.target.value.replace(/(_|-|(|))/g,'').length == 14) {
                                this.setState({aux: update(this.state.aux, 
                                  {
                                    phonemask: {$set: "(11) 11111-1111"},
                                  })
                                })
                              }
                              else {
                                this.setState({aux: update(this.state.aux, 
                                  {
                                    phonemask: {$set: "(11) 1111-11111"},
                                  })
                                })
                              }
                            }
                          }
                        />
                      </label>
                    </div>

                    <div className="field-input">
                      <h6>Telefone 2:</h6>
                      <label>
                        <MaskedInput
                          mask={this.state.aux.phonemask} 
                          type="text" 
                          className='input-field' 
                          name="phone2" 
                          value={this.state.user.phone2} 
                          onChange={this.handleInputUserChange.bind(this)} 
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
                          onChange={this.handleInputUserChange.bind(this)} 
                        />
                      </label>
                    </div>

                    <div>
                      <h6>Observações:</h6>
                      <label>
                        <textarea  
                          className='input-field materialize-textarea'
                          placeholder="Deixe este campo em branco caso não exista observações a serem feitas" 
                          name="note" 
                          value={this.state.user.note} 
                          onChange={this.handleInputUserChange.bind(this)} 
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
                              type="password" 
                              className='input-field' 
                              name="password" 
                              value={this.state.aux.password}
                              onChange={this.handleChange.bind(this)} 
                            />
                          </label>
                        </div>
                        
                        <div className="field-input">
                          <h6>Confirmação de senha:</h6>
                          <label>
                            <input 
                              type="password" 
                              className='input-field' 
                              name="password_confirmation" 
                              value={this.state.aux.password_confirmation} 
                              onChange={this.handleChange.bind(this)} 
                            />
                          </label>
                        </div>

                        {this.props.is_edit ?
                          <div className="field-input">
                            <h6>Nova senha: <i>(mínimo 6 caracteres)</i></h6>
                            <label>
                              <input 
                                type="password" 
                                className='input-field' 
                                name="current_password" 
                                value={this.state.aux.current_password}
                                onChange={this.handleChange.bind(this)} 
                              />
                            </label>
                          </div>
                        : null}

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

const UserForm = connect()(getUserForm)
export default UserForm
