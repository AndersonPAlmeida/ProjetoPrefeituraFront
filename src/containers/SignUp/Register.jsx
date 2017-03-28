import React from 'react';
import { connect } from 'react-redux';
import { EmailSignUpForm } from "../../redux-auth/views/default";
import { browserHistory } from 'react-router';
import { Button, Card, Row, Col, Input as _Input } from 'react-materialize';
import styles from '../styles/SignUpForm.css';
import Input from "../../redux-auth/views/default/Input";
import UserImg from '../../../public/user.png'
import Home from '../Home';

class SignUp extends React.Component {
  selectDay(){
      var days = [];
      for(var i = 1; i <= 31; i++){
        days.push(
          <option value={i}>{i}</option>
        );
      }
      return (
              <_Input s={12} l={3} type='select'>
                {days}
              </_Input>
              )
  }
  selectMonth(){
      var options = []
      var months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      for(var i = 0; i < 12; i++){
        options.push(
          <option value={i+1}>{months[i]}</option>
        );
      }
      return (
              <_Input s={12} l={4} type='select'>
                {options}
              </_Input>
              )
  }
  selectYear(){
      var options = []
      var year = new Date().getFullYear()
      for(var i = 1900; i < year; i++){
        options.push(
          <option value={i-1899}>{i}</option>
        );
      }
      return (
              <_Input s={12} l={4} type='select'>
                {options}
              </_Input>
              )
  }
  render() {
    return (
        <div className='card-content'>
          <h2 className='card-title'>Cadastro de Cidadão:</h2>
          <p>Para mais informações sobre como usar o Sistema Agendador de Serviços Públicos visite o Manual de Utilização ou a seção de Perguntas Frequentes.</p>
          <EmailSignUpForm next={() => browserHistory.push('/pageone')}>
            <Row className='second-line'>
              <Col s={12} m={12} l={6}>
                <div className={styles['category-title']}>
                  <p>Informações Pessoais</p>
                </div>
                <div>
                    <img
                      src={UserImg} />
                </div>
                <div className={styles['Input-file'] + ' btn'}>
                  <Input type='file'
                    value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "photo"])}
                    errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "photo"])}
                    onChange={this.handleInput.bind(this, "photo")} />
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
                  <Input name='rg' 
                    label="RG:*"
                    placeholder="RG"
                    value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "rg"])}
                    errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "rg"])}
                    onChange={this.handleInput.bind(this, "rg")} />
                </div>
                <div>
                  <Input name='sus_number' 
                    label="Cartão SUS:*:"
                    placeholder="Cartão SUS"
                    value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "sus_number"])}
                    errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "sus_number"])}
                    onChange={this.handleInput.bind(this, "sus_number")} />
                </div>
                <div>
                  <label>Data de Nascimento</label>
                  <div>
                    {this.selectDay()}
                    {this.selectMonth()}
                    {this.selectYear()}
                  </div>
                </div>
                <label>Possui algum tipo de deficiência?</label>
                <div>
                  <_Input name='group1' type='radio' value='red' label='Sim' />
                  <_Input name='group1' type='radio' value='yellow' label='Não' />
                </div>
                <br />
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
                  <p>Endereço</p>
                </div>
                <div>
                  <Input name='cep' 
                    label="CEP:*"
                    placeholder="CEP"
                    value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "email"])}
                    errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "email"])}
                    onChange={this.handleInput.bind(this, "email")} />
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
                  <label>Complemento:</label>
                  <Input name='address_complement' 
                    label="Complemento:"
                    placeholder="Complemento"
                    value={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "form", "address_complement"])}
                    errors={this.props.auth.getIn(["emailSignUp", this.getEndpoint(), "errors", "address_complement"])}
                    onChange={this.handleInput.bind(this, "address_complement")} />
                </div>
              </Col>
            </Row>
          </EmailSignUpForm>
        </div>
    );
  }
}
export default connect(({ routes }) => ({ routes }))(SignUp);
