import React, {Component} from 'react'
import { Link } from 'react-router'
import NavMenu from './NavMenu.jsx'

class PageTwo extends Component {
  render() {
    return (
      <div>
        <NavMenu /> 
        <Link to="/pageone">Page One</Link>
        Page Two 
      </div>
    )
  }
}

export default PageTwo
