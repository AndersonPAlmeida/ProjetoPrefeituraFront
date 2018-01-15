import React, {Component} from 'react'
import { Button, Card, Row, Col, Dropdown, Input } from 'react-materialize'
import styles from './styles/ShiftForm.css'
import { connect } from 'react-redux'

class getShiftForm extends Component {

 constructor(props) {
    super(props)
  }

  render() {
    return (
      <Row s={12}>
        <div className='card'>
          <div className='card-content'>
            <Row></Row>
          </div>
        </div>
      </Row>
    )
  }
}

const ShiftForm = connect()(getShiftForm)
export default ShiftForm
