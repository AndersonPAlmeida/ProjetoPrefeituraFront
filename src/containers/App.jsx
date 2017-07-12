import React, {Component} from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import Home from './Home';
import { AuthGlobals } from "../redux-auth/views/default";

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
        >
          <div> </div> 
        </Home>
      </div>
    )
  }
}
getApp.propTypes = {
  children: PropTypes.any,
};
const mapStateToProps = (state) => {
  return {
    is_authenticated: state.get('auth').getIn(['user', 'isSignedIn'])
  }
}
const App = connect(
  mapStateToProps
)(getApp)
export default App

