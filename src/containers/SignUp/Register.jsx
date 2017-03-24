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
            <Row className='second-line'>
              <Col s={12} m={12} l={6}>
                <div className={styles['category-title']}>
                  <p>Informações Pessoais</p>
                </div>
                <div>
                    <img
                      src={UserImg} />
                </div>
                <div className={styles['input-file'] + ' btn'}>
                  <input type='file'></input>
                </div>
                <div>
                  <label>Nome:*</label>
                  <input name='name' placeholder='Nome'></input>
                </div>
                <div>
                  <label>RG:*</label>
                  <input name='rg' placeholder='RG'></input>
                </div>
                <div>
                  <label>Cartão SUS:</label>
                  <input name='sus_number' placeholder='Cartão SUS'></input>
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
                  <Input name='group1' type='radio' value='red' label='Sim' />
                  <Input name='group1' type='radio' value='yellow' label='Não' />
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
                  <label>CEP:*</label>
                  <input name='cep' placeholder='CEP'></input>
                </div>
                <div>
                  <label>Estado:</label>
                  <input name='state' placeholder='Estado'></input>
                </div>
                <div>
                  <label>Município:</label>
                  <input name='city' placeholder='Município'></input>
                </div>
                <div>
                  <label>Bairro:</label>
                  <input name='neighborhood' placeholder='Bairro'></input>
                </div>
                <div>
                  <label>Endereço:</label>
                  <input name='address_street' placeholder='Endereço'></input>
                </div>
                <div>
                  <label>Número:</label>
                  <input name='address_number' placeholder='Número'></input>
                </div>
                <div>
                  <label>Complemento:</label>
                  <input name='address_complement' placeholder='Complemento'></input>
                </div>
              </Col>
            </Row>
          </EmailSignUpForm>
        </div>
    );
  }
}
export default connect(({ routes }) => ({ routes }))(SignUp);
