import React, {Component} from 'react'
import { Link } from 'react-router'
import {GovernmentBar, Header, Footer} from './Common.js'

class PageOne extends Component {
  render() {
    return (
      <div> 
      	<GovernmentBar />
        Page One 
        <Link to="/pagetwo">Page Two</Link>
      </div>
    )
  }
}

export default PageOne 
