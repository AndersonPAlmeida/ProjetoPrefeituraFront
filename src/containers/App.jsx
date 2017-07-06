import React from 'react';
import { AuthGlobals } from "../redux-auth/views/default";
import PropTypes from 'prop-types';
import Home from './Home';
import { connect } from 'react-redux'
import { Link } from 'react-router';
var Breadcrumbs = require('react-breadcrumbs');

class getApp extends React.Component {
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
        <Home 
          footerItems={ this.props.is_authenticated ? footerItems : [ footerItems[3] ] }
          showHeader={ this.props.is_authenticated ? false : true }
        >
          { this.props.children } 
        </Home>
      </div>
    );
  }
}
getApp.propTypes = {
  children: PropTypes.any,
};
const mapStateToProps = (state) => {
  return {
    is_authenticated: state.auth.getIn(['user', 'isSignedIn'])
  }
}
const App = connect(
  mapStateToProps
)(getApp)
export default App
