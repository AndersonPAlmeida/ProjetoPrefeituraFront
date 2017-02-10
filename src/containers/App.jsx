import React from 'react';
import * as DefaultTheme from 'redux-auth';

export default class App extends React.Component {
  render() {
    return ( 
      <div> 
        <DefaultTheme.AuthGlobals />
        {this.props.children} 
      </div>
    );
  }
}
App.propTypes = {
  children: React.PropTypes.any,
};
