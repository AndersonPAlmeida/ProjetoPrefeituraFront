import React, { PropTypes } from "react";
import Input from "./Input";
import ButtonLoader from "./ButtonLoader";
import { Row, Col, Card, Button, Input as _Input } from 'react-materialize';
import { emailSignUpFormUpdate, emailSignUp } from "../../actions/email-sign-up";
import { connect } from "react-redux";
import styles from '../../../containers/styles/SignUpForm.css'
import UserImg from '../../../../public/user.png'
import Home from '../../../containers/Home';

class EmailSignUpForm extends React.Component {
  static propTypes = {
    endpoint: PropTypes.string,
    next: PropTypes.func,
    icon: PropTypes.string,
    inputProps: PropTypes.shape({
      cpf: PropTypes.object,
      password: PropTypes.object,
      passwordConfirmation: PropTypes.object,
      submit: PropTypes.object
    })
  };

  constructor(props) {
        super(props);
        this.state = { 
          check: false,
        };
        this.handleChange = this.handleChange.bind(this);
  }

  static defaultProps = {
    next: () => {},
    inputProps: {
      cpf: {},
      password: {},
      submit: {}
    }
  };

  selectDate(){ 
      var optionsDays = []; 
      for(var i = 1; i <= 31; i++){
        optionsDays.push(
          <option key={i} value={i}>{i}</option>
        );
      }
      var optionsMonths = []
      var months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      for(var i = 0; i < 12; i++){
        optionsMonths.push(
          <option key={i+1} value={i+1}>{months[i]}</option>
        );
      }
      var optionsYears = []
      var year = new Date().getFullYear()
      for(var i = 1900; i < year; i++){
        optionsYears.push(
          <option key={i-1899} value={i-1899}>{i}</option>
        );
      }
      return (
            <div>
              <Input s={12} l={3} type='select'
                value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "birth_day"])}
                errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "birth_day"])}
                onChange={this.handleInput.bind(this, "birth_day")}
                materializeComp={true}
              >
                {optionsDays}
              </Input>
            
              <Input s={12} l={3} type='select'
                value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "birth_month"])}
                errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "birth_month"])}
                onChange={this.handleInput.bind(this, "birth_month")}
                materializeComp={true}
              >
                {optionsMonths}
              </Input>

              <Input s={12} l={3} type='select'
                value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "birth_year"])}
                errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "birth_year"])}
                onChange={this.handleInput.bind(this, "birth_year")}
                materializeComp={true}
              >
                {optionsYears}
              </Input>

            </div>
              )
  }
 
  handleChange(event){
    this.setState({check: event.target.value})
  }

  getEndpoint () {
    return (
      this.props.endpoint ||
      this.props.auth.getIn(["configure", "currentEndpointKey"]) ||
      this.props.auth.getIn(["configure", "defaultEndpointKey"])
    );
  }

  handleInput (key, val) {
    this.props.dispatch(emailSignUpFormUpdate(this.getEndpoint(), key, val));
  }

  handleSubmit (event) {
    event.preventDefault();
    let formData = this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form"]).toJS();
    formData['cpf'] = formData['cpf'].replace(/(\.|-)/g,'');
    formData['birth_date'] = formData['birth_day'] + '/' + formData['birth_month'] + '/' + formData['birth_year'];
    var { birth_day, birth_month, birth_year, confirm_success_url, config_name, registration, ...other } = formData;
    this.props.dispatch(emailSignUp(other, this.getEndpoint()))
      .then(this.props.next)
      .catch(() => {});
  }

  render () {
    return (
      <main className={styles['main-signup']}>
        <div className='container'>
          <Row className={styles['form-signup']}>
            <Col>
              <div className='card'>
                <form className='redux-auth email-sign-up-form'
                      style={{clear: "both", overflow: "hidden"}}
                      onSubmit={this.handleSubmit.bind(this)}>
                  <div className='card-content'>
                    <h2 className='card-title'>Cadastro de Cidadão:</h2>
                    <p>Para mais informações sobre como usar o Sistema Agendador de Serviços Públicos visite o Manual de Utilização ou a seção de Perguntas Frequentes.</p>
                    <Row className='first-line'>
                      <Col s={12} m={12} l={6}>
                        <div className={styles['category-title']}>
                          <p>Informações de Login</p>
                        </div>
                        <div>
                            <img
                              src={UserImg} />
                            <div>
                              <Input type='file'
                              value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "photo"])}
                              errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "photo"])}
                              onChange={this.handleInput.bind(this, "photo")} />
                            </div>
                        </div>
                        <div>
                          <Input name='name'
                            label="Nome:*"
                            placeholder="Nome"
                            value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "name"])}
                            errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "name"])}
                            onChange={this.handleInput.bind(this, "name")} />
                        </div>
                        <div>
                        <Input type="text"
                               label="CPF:*"
                               placeholder="CPF"
                               name="cpf"
                               mask="111.111.111-11"
                               className="email-sign-up-email"
                               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "cpf"])}
                               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "cpf"])}
                               onChange={this.handleInput.bind(this, "cpf")}
                               {...this.props.inputProps.cpf} />
                        </div>
                        <div>
                          <Input name='rg'
                            label="RG:*"
                            placeholder="RG"
                            value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "rg"])}
                            errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "rg"])}
                            onChange={this.handleInput.bind(this, "rg")} />
                        </div>
                        <div>
                          <label>Data de Nascimento:*</label>
                            {this.selectDate()}
                        </div>
                        <label>Possui algum tipo de deficiência?</label>
                        <div>
                          <_Input onChange={this.handleChange} s={12} l={12} name='group1' type='radio' value='true' label='Sim' />
                          <_Input onChange={this.handleChange} defaultChecked='true' s={12} l={12} name='group1' type='radio' value='' label='Não' />
                          { this.state.check ? <Input name='pcd'
                                                  label="Qual tipo de deficiência?"
                                                  value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "pcd"])}
                                                  errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "pcd"])}
                                                  onChange={this.handleInput.bind(this, "pcd")} /> : null }
                        </div>
                        
                        
                      </Col>
                      <Col s={12} m={12} l={6}>
                        <div className={styles['category-title']}>
                          <p>Endereço</p>
                        </div>
                        <div>
                          <Input name='cep'
                            label="CEP:*"
                            placeholder="CEP"
                            value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "cep"])}
                            errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "cep"])}
                            onChange={this.handleInput.bind(this, "cep")} />
                        </div>
                        <div>
                          <Input name='state' placeholder='Estado'
                            label="Estado:"
                            placeholder="Estado"
                            value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "state"])}
                            errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "state"])}
                            onChange={this.handleInput.bind(this, "state")} />
                        </div>
                        <div>
                          <Input name='city' placeholder='Município'
                            label="Município:"
                            placeholder="Município"
                            value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "city"])}
                            errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "city"])}
                            onChange={this.handleInput.bind(this, "city")} />
                        </div>
                        <div>
                          <Input name='neighborhood'
                            label="Bairro:"
                            placeholder="Bairro"
                            value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "neighborhood"])}
                            errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "neighborhood"])}
                            onChange={this.handleInput.bind(this, "neighborhood")} />
                        </div>
                        <div>
                          <Input name='address_street'
                            label="Endereço:"
                            placeholder="Endereço"
                            value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "address_street"])}
                            errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "address_street"])}
                            onChange={this.handleInput.bind(this, "address_street")} />
                        </div>
                        <div>
                          <Input name='address_number' placeholder='Número'
                            label="Número:"
                            placeholder="Número"
                            value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "address_number"])}
                            errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "address_number"])}
                            onChange={this.handleInput.bind(this, "address_number")} />
                        </div>
                        <div>
                          <Input name='address_complement'
                            label="Complemento:"
                            placeholder="Complemento"
                            value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "address_complement"])}
                            errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "address_complement"])}
                            onChange={this.handleInput.bind(this, "address_complement")} />
                        </div>
                      </Col>
                    </Row>
                    <Row className='second-line'>
                      <Col s={12} m={12} l={6}>
                          <div className={styles['category-title']}>
                            <p>Informações de Contato</p>
                          </div>
                          <div>
                            <Input name='phone1'
                              label="Telefone 1:*" 
                              placeholder="Telefone 1"
                              value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "phone1"])}
                              errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "phone1"])}
                              onChange={this.handleInput.bind(this, "phone1")} />
                          </div>
                          <div>
                            <Input name='phone2' placeholder='Telefone 2'
                              label="Telefone 2:*" 
                              placeholder="Telefone 2"
                              value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "phone2"])}
                              errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "phone2"])}
                              onChange={this.handleInput.bind(this, "phone2")} />
                          </div>
                          <div>
                            <Input name='email' 
                              label="Email:" 
                              placeholder="Email"
                              value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "email"])}
                              errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "email"])}
                              onChange={this.handleInput.bind(this, "email")} />
                          </div>
                          <p>
                            <i className="material-icons tiny yellow-text text-darken-3 info-icon">info_outline</i>
                            Sem cadastrar um email você não poderá receber lembretes e confirmação de agendamentos por e-mail nem recuperar sua senha.
                          </p>
                          <br></br>
                          <div>
                            <p><label>Observações:</label></p>
                            <textarea
                              name='note'
                              placeholder="Deixe este campo em branco caso não exista observações a serem feitas"
                              className="materialize-textarea" ></textarea>
                          </div>
                          <p>
                            <font color="red">  Campos com (*) são de preenchimento obrigatório. </font>
                          </p>
                        </Col>
                      
                    <Col s={12} m={12} l={6}>
                        <div className={styles['category-title']}>
                          <p>Senha</p>
                        </div>
                        <div>
                        <Input type="password"
                               name="password"
                               label="Senha:*"
                               placeholder="Senha"
                               className="email-sign-up-password"
                               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "password"])}
                               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "password"])}
                               onChange={this.handleInput.bind(this, "password")}
                               {...this.props.inputProps.password} />
                        </div>
                        <div>
                        <Input type="password"
                               label="Confirmação de Senha:*"
                               placeholder="Confirmação de Senha"
                               name="password_confirmation"
                               className="email-sign-up-password-confirmation"
                               value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "password_confirmation"])}
                               errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "password_confirmation"])}
                               onChange={this.handleInput.bind(this, "password_confirmation")}
                               {...this.props.inputProps.passwordConfirmation} />
                        </div>
                      </Col>
                    </Row>
                    <div className='card-action'>
                      <ButtonLoader type="submit"
                                    className="email-sign-up-submit back-bt waves-effect right"
                                    primary={true}
                                    style={{float: "right"}}
                                    icon={this.props.icon}
                                    onClick={this.handleSubmit.bind(this)}
                                    {...this.props.inputProps.submit}>
                        Criar Conta
                      </ButtonLoader>
                      <a className='back-bt waves-effect btn-flat'> Voltar </a>
                    </div>
                  </div>
                </form>
              </div>
            </Col>
          </Row>
        </div>
      </main>
    );
  }
}

export default connect(({auth}) => ({auth}))(EmailSignUpForm);
