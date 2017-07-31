import React from 'react';
import { Button, Card, Row, Col } from 'react-materialize';
import styles from './styles/SignUp.css';
import { SignUpCEP } from "../../redux-auth/views/default";
import { browserHistory } from "react-router";
class RegisterCep extends React.Component {
	render () {
		return(
      <div>
        <main className={styles['main-cep']}>
          <div className='container'>
            <Row className={styles['cep']}>
              <Col s={12} m={12} l={12} >
                <SignUpCEP next={() => browserHistory.push('/signup2')} prev={() => browserHistory.push('/')} />
              </Col>
            </Row>
          </div>			
        </main>
      </div>
    )
	}
}
export default RegisterCep
