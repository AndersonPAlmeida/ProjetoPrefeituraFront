import React from 'react';
import { AuthGlobals } from "../redux-auth/views/default";
import PropTypes from 'prop-types';
import Home from './Home';
export default class App extends React.Component {
  render() {
    const footerItems = [
                          { 'name': 'Perguntas e Respostas', 'link': '/agendador/faq' },
                          { 'name': 'Contato', 'link': '/agendador/contact' },
                          { 'name': 'Comunicar um erro', 'link': '/agendador/report' },
                          { 'name': 'Manual', 'link': '/agendador/manual' }
                        ]
    return ( 
      <div> 
        <AuthGlobals />
        <Home footerItems={footerItems}>
          {this.props.children} 
        </Home>
      </div>
    );
  }
}
App.propTypes = {
  children: PropTypes.any,
};
