import React, {Component} from 'react'
import { Link } from 'react-router'

class PageOne extends Component {
  render() {
    return (
      <div> 
        Page One 
        <Link to="/pagetwo">Page Two</Link>
      </div>
    )
  }
}

export default PageOne 
