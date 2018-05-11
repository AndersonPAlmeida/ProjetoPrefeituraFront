import React, {Component} from 'react'
import { connect } from 'react-redux'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import update from 'react-addons-update';
import styles from './styles/CityHall.css'
import { browserHistory } from 'react-router';


import { Button, Card, Row, Col, Dropdown, Input, CardPanel } from 'react-materialize'

class editCityHall extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dependant: [],
      city_hall: {
        name: ""
      }
    };
  }


  prev() {
    browserHistory.push(`/city_hall`)
  }



  render(){
    return(
      <main>
        <Row>
          <Col s={12}>
            <div className='card'>
              <div className='card-content'>
                <Row className='city-hall-content' >
                    <h2 className="card-title">Alterar Prefeitura: {this.state.city_hall.name}</h2>
                    <Col s={"12"} m={6}>
                      <Row className='city-hall-first-row'>
                        <Col s={12}>
                          <h6>Situação*:</h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>CEP*:</h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Estado:</h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Endereço da sede*:</h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Complemento</h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Antecedência para enviar email avisando de um agendamento(horas)*: </h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Telefone 2:</h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>E-mail de suporte</h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>LOGOTIPO</h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>ESCOLHER PROFISSIONAL</h6>
                        </Col>
                        <Col s={12}>
                          <Input type='switch'/>
                        </Col>
                        <Col s={12}>
                          <h6>PERMITIR CADASTRO PELA INTERNET</h6>
                        </Col>
                        <Col s={12}>
                          <Input type='switch'/>
                        </Col>
                      </Row>
                    </Col>
                    <Col s={"12"} m={6}>
                      <Row className='city-hall-first-row'>
                        <Col s={12}>
                          <h6>Nome*:</h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Bairro*:</h6>
                        </Col>
                        <Col s={12}>
                         <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Munícipio*:</h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Número/:</h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Período para contagem de agendamentos(dias)*: </h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Telefone 1*:</h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>E-mail</h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Site:</h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Descrição*:</h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                      <Row>
                        <Col s={12}>
                          <h6>Permitir que utilize o agendador pela internet?</h6>
                        </Col>
                        <Col s={12}>
                          <Input />
                        </Col>
                      </Row>
                    </Col>
                </Row>
                <p className="red-text">Campos com (*) são de preenchimento obrigatório.</p>
              </div>
            </div>
          </Col>
        </Row>
      </main>

    );
  }

}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  return {
    user
  }
}
const EditCityHall = connect(
  mapStateToProps
)(editCityHall)
export default EditCityHall
