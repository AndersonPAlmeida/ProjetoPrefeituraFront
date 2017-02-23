import React, {Component} from 'react'
import { Link } from 'react-router'

class PageTwo extends Component {
  render() {
    return (
      <div> 
        <Link to="/pageone">Page One</Link>
        Page Two 
      </div>
    )
  }
}

export default PageTwo
