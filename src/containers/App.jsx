import React from 'react';
import { AuthGlobals } from "../redux-auth/views/default";
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
  children: React.PropTypes.any,
};
