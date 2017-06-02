import React, {Component} from 'react'
import {GovernmentBar, Header, Footer} from './Common.js'
export default class Home extends React.Component {
  render() {
    return (
      <div>
        <GovernmentBar />
        <div>
          {this.props.showHeader ? <Header /> : <div />}
          {this.props.children}
          <Footer footerItems={this.props.footerItems} />
        </div>
      </div>
    )
  }
}
