import React, {Component} from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import Home from './Home';
import { AuthGlobals } from "../../redux-auth/views/default";
import { Link } from 'react-router';

class getApp extends Component {
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
          showMenu={ this.props.is_authenticated ? true : false }
        >
          { this.props.children }
        </Home>
      </div>
    )
  }
}
getApp.propTypes = {
  children: PropTypes.any,
};
const mapStateToProps = (state) => {
  const is_authenticated = state.get('auth').getIn(['user', 'isSignedIn'])
  return {
    is_authenticated
  }
}
const App = connect(
  mapStateToProps
)(getApp)
export default App
