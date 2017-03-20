import React, {Component} from 'react'
import {GovernmentBar, Header, Footer} from './Common.js'
import Login from './Login'

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <GovernmentBar />
        <div>
          <Header />
          {this.props.children}
          <Footer />
        </div>
      </div>
    )
  }
}
