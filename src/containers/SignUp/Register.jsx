import React from 'react';
import { connect } from 'react-redux';
import { EmailSignUpForm } from "../../redux-auth/views/default";
import { browserHistory } from 'react-router';
import { Button, Card, Row, Col, Input } from 'react-materialize';
import styles from '../styles/SignUpForm.css';
import MaskedInput from 'react-maskedinput';
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
              <Input s={12} l={3} type='select'>
                {days}
              </Input>
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
              <Input s={12} l={4} type='select'>
                {options}
              </Input>
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
              <Input s={12} l={4} type='select'>
                {options}
              </Input>
              )
  }
  render() {
    return (
        <div className='card-content'>
          <h2 className='card-title'>Cadastro de Cidadão:</h2>
          <p>Para mais informações sobre como usar o Sistema Agendador de Serviços Públicos visite o Manual de Utilização ou a seção de Perguntas Frequentes.</p>
          <EmailSignUpForm next={() => browserHistory.push('/pageone')}>
            <Row className='first-line'>
              <Col s={12} m={12} l={6}>
                <div>
                    <img
                      src={UserImg} />
                </div>
                <div className={styles['input-file'] + ' btn'}>
                  <input type='file'></input>
                </div>
                <div>
                  <h6>Nome:*</h6>
                  <input></input>
                </div>
                <div>
                  <h6>RG:*</h6>
                  <input></input>
                </div>
                <div>
                  <h6>Cartão SUS:</h6>
                  <input></input>
                </div>
                  <h6>Data de Nascimento</h6>

                  {this.selectDay()}
                  {this.selectMonth()}
                  {this.selectYear()}

                <h6>Possui algum tipo de deficiência?</h6>
                <div>
                  <Input name='group1' type='radio' value='red' label='Sim' />
                  <Input name='group1' type='radio' value='yellow' label='Não' />
                </div>
              </Col>
              <Col s={12} m={12} l={6}>
                <div className={styles['category-title']}>
                  <p>Endereço</p>
                </div>
                <div>
                  <h6>CEP:*</h6>
                  <input></input>
                </div>
                <div>
                  <h6>Estado:</h6>
                  <input></input>
                </div>
                <div>
                  <h6>Município:</h6>
                  <input></input>
                </div>
                <div>
                  <h6>Bairro:</h6>
                  <input></input>
                </div>
                <div>
                  <h6>Endereço:</h6>
                  <input></input>
                </div>
                <div>
                  <h6>Número</h6>
                  <input></input>
                </div>
                <div>
                  <h6>Complemento:</h6>
                  <input></input>
                </div>
              </Col>
            </Row>
            <Row className='second-line'>
              <Col s={12} m={12} l={6}>
                <div className={styles['category-title']}>
                  <p>Informações de Contato</p>
                </div>
                <div>
                  <h6>Telefone 1:*</h6>
                  <input></input>
                </div>
                <div>
                  <h6>Telefone 2:</h6>
                  <input></input>
                </div>
                <div>
                  <h6>E-mail:</h6>
                  <input></input>
                </div>
                <p>
                  <i className="material-icons tiny yellow-text text-darken-3 info-icon">info_outline</i>
                  Sem cadastrar um e-mail você não poderá receber lembretes e confirmação de agendamentos por e-mail nem recuperar sua senha.
                </p>
                <br></br>
                <div>
                  <h6>Observações:</h6>
                  <textarea
                    placeholder="Deixe este campo em branco caso não exista observações a serem feitas"
                    className="materialize-textarea" ></textarea>
                </div>
                <p>
                  <font color="red">  Campos com (*) são de preenchimento obrigatório. </font>
                </p>
              </Col>
            </Row>
          </EmailSignUpForm>
        </div>
    );
  }
}
export default connect(({ routes }) => ({ routes }))(SignUp);
