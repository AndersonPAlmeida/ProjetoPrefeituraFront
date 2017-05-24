import React from 'react';
import { AuthGlobals } from "../redux-auth/views/default";
import PropTypes from 'prop-types';
export default class App extends React.Component {
  render() {
    return ( 
      <div> 
        <AuthGlobals />
        {this.props.children} 
      </div>
    );
  }
}
App.propTypes = {
  children: PropTypes.any,
};
