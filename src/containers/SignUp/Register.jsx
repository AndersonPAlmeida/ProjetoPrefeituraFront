import React from 'react';
import { connect } from 'react-redux';
import { EmailSignUpForm } from "../../redux-auth/views/default";
import { browserHistory } from 'react-router';

class SignUp extends React.Component {
  render() {
    return (
        <div className='card-content'>
          <h2 className='card-title'>Cadastro de Cidadão:</h2>
          <p>Para mais informações sobre como usar o Sistema Agendador de Serviços Públicos visite o Manual de Utilização ou a seção de Perguntas Frequentes.</p>
          <EmailSignUpForm next={() => browserHistory.push('/pageone')} />
        </div>
    );
  }
}
export default connect(({ routes }) => ({ routes }))(SignUp);
