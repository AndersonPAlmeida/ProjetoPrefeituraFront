import React, {Component} from 'react'
import { Link } from 'react-router'
import {GovernmentBar, Header, Footer, NavBar} from './Common.js'

class PageOne extends Component {
  render() {
    return (
      <div> 
      	<GovernmentBar />
      	<NavBar />
      	<Footer />
      </div>
    )
  }
}

export default PageOne 
