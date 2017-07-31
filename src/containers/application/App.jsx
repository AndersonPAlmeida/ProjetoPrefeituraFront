import React, {Component} from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import Home from './Home';
import { AuthGlobals } from "../../redux-auth/views/default";
import { getBreadcrumbs } from "../utils/breadcrumbs";
import { Link } from 'react-router';

class getApp extends Component {
  render() {
    const footerItems = [
                          { 'name': 'Perguntas e Respostas', 'link': '/agendador/faq' },
                          { 'name': 'Contato', 'link': '/agendador/contact' },
                          { 'name': 'Comunicar um erro', 'link': '/agendador/report' },
                          { 'name': 'Manual', 'link': '/agendador/manual' }
                        ]
    const navHist = this.props.breadcrumbs.map((item, idx) => {
            return <div key={item.name} style={ { display: 'inline' } }> { (idx == 0) ? '' : ' > ' } <Link to={item.link}>{item.name}</Link></div>
        });
    return (
      <div>
        <AuthGlobals />
        <div />
        <Home 
          footerItems={ this.props.is_authenticated ? footerItems : [ footerItems[3] ] }
          navHistory={ this.props.is_authenticated ? navHist : <div /> }
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
  var breadcrumbs = []
  if(is_authenticated) {
    var bc_array = state.get('routing').getIn(['locationBeforeTransitions']).pathname.split('/').filter(Boolean)
    var bc_key = bc_array[bc_array.length-1]
    breadcrumbs = getBreadcrumbs(bc_key)
  }
  return {
    is_authenticated,
    breadcrumbs
  }
}
const App = connect(
  mapStateToProps
)(getApp)
export default App
