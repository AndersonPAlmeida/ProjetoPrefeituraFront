import React from 'react';
import { Button, Card, Row, Col } from 'react-materialize';
import styles from '../styles/SignUp.css';
import MaskedInput from 'react-maskedinput';
import Home from '../Home';
export const SignUpCEP = () => (
		<div className='card'>
			<form>
				<div className='card-content'>
					<h2 className='card-title'>Digite seu CEP</h2>
					<p>Para podermos verificar a disponibilidade do agendador na sua cidade, informe seu CEP.</p>
					<MaskedInput 
						placeholder='CEP'
						mask='11111-111' />
				</div>
				<div className='card-action'>
					<button className='btn waves-effect right'> Enviar </button>
					<a className='back-bt waves-effect btn-flat'> Voltar </a>
				</div>
			</form>
		</div>
)
class RegisterCep extends React.Component {
	render () {
		return(
      <Home>
        <main className={styles['main']}>
          <div className='container'>
            <Row className={styles['cep']}>
              <Col s={12} m={12} l={12} >
                <SignUpCEP />
              </Col>
            </Row>
          </div>			
        </main>
      </Home>
    )
	}
}
export default RegisterCep
