import React from 'react';
import { AuthGlobals } from "../redux-auth/views/default";
import PropTypes from 'prop-types';
import Home from './Home';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import { Link } from 'react-router';

class getApp extends React.Component {
  render() {
    const footerItems = [
                          { 'name': 'Perguntas e Respostas', 'link': '/agendador/faq' },
                          { 'name': 'Contato', 'link': '/agendador/contact' },
                          { 'name': 'Comunicar um erro', 'link': '/agendador/report' },
                          { 'name': 'Manual', 'link': '/agendador/manual' }
                        ]
    const navHistory = this.props.path.map((item, idx) => {
        return <div style={ { display: 'inline' } }> { item.link == '/' ? '' : ' > ' } <Link key={idx} to={item.link}>{item.name}</Link></div>
    });
    return ( 
      <div> 
        <AuthGlobals />
        <Home 
          footerItems={ this.props.is_authenticated ? footerItems : [ footerItems[3] ] }
          showHeader={ this.props.is_authenticated ? false : true }
        >
          { this.props.is_authenticated ? navHistory : <div /> }
          {this.props.children} 
        </Home>
      </div>
    );
  }
}
getApp.propTypes = {
  children: PropTypes.any,
};
const mapStateToProps = (state) => {
  var path = [ { 'name': 'Home', 'link': '/' } ] 
  var arr_path = state.routing.locationBeforeTransitions.pathname.split('/').filter(Boolean)
  var str_path = ''
  arr_path.map(function(item) {
    str_path = str_path + '/' + item
    path.push( { 'name': item, 'link': str_path } )
  })
  return {
    is_authenticated: state.auth.getIn(['user', 'isSignedIn']),
    path
  }
}
const App = connect(
  mapStateToProps
)(getApp)
export default App
