import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import UserForm from '../utils/UserForm'
import { browserHistory } from 'react-router';

class getCityHallCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //TODO
    };
  }

  componentDidMount() {
  //TODO
  }

  prev() {
    browserHistory.push(`/city_hall/create`)
  }

  render() {
    return (
      <div>
        //TODO
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  return {
    user
  }
}
const CityHallCreate = connect(
  mapStateToProps
)(getCityHallCreate)
export default CityHallCreate
