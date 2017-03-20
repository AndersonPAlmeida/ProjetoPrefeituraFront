import React, {Component} from 'react'
import { Button, Card, Row, Col } from 'react-materialize'
import styles from './styles/Login.css'
import LoginImg from '../../public/login6.png'
import ScheduleImg from '../../public/schedule2.png'
import DoneImg from '../../public/done.png'
import SignIn from './SignIn'
import Home from './Home'

export const Infographic = () => (
        <div>
          <div>
            <div className={styles['info-text']}>
              <p> O aplicativo Agendador foi desenvolvido para viabilizar a
                <b> automatização do agendamento</b> dos atendimentos com hora marcada  
                <b> em órgãos públicos</b>, permitindo que uma prefeitura crie, por exemplo, 
                horários de atendimento para médicos em postos de saúde.
              </p>
            </div>
            <Row>
              <Col s={10} m={4} offset="s1" >
                <div id='steps-row'>
                  <div id={styles['step1']} className={styles['steps']}>
                    <div className={styles['step-header']}>
                      <div className={styles['title']}>1º Passo</div>
                      <div className={styles['step-description']}>
                        Faça login ou <br />
                        cadastre-se.
                      </div>
                    </div>
                    <div className={styles['step-body']}>
                      <img
                      className={styles['step-img']}
                        src={LoginImg}
                        />
                    </div>
                  </div>
                </div>
              </Col>
              <Col s={10} m={4} offset="s1" >
                <div id={styles['steps-row']}>
                  <div id={styles['step2']} className={styles['steps']}>
                    <div className={styles['step-header']}>
                      <div className={styles['title']}>2º Passo</div>
                      <div className={styles['step-description']}>
                        Marque <br />
                        seu agendamento.
                      </div>
                    </div>
                    <div className={styles['step-body']}>
                      <img
                      className={styles['step-img']}
                        src={ScheduleImg}
                        />
                    </div>
                  </div>
                </div>
              </Col>
              <Col s={10} m={4} offset="s1" >
                <div id='steps-row'>
                  <div id={styles['step3']} className={styles['steps']}>
                    <div className={styles['step-header']}>
                      <div className={styles['title']}>3º Passo</div>
                      <div className={styles['step-description']}>
                        Compareça na data <br />
                        marcada.
                      </div>
                    </div>
                    <div className={styles['step-body']}>
                      <img
                      className={styles['step-img']}
                        src={DoneImg}
                        />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
)

class Login extends Component {
  
  render() {
    return (
      <Home>
        <div className={styles['main']}>
          <Row>
            <Col s={12} m={12} l={7}>
              <Infographic />
            </Col>
            <Col s={12} m={12} l={4} className='right'>
              <SignIn />
            </Col>
          </Row>
        </div>
      </Home>
    )
  }

}

export default Login
