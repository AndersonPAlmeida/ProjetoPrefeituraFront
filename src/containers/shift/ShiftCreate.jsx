import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import ShiftForm from './ShiftForm'
import { browserHistory } from 'react-router';

class getShiftCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shift: []
    };
  }

  prev() {
    browserHistory.push(`/shifts`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <ShiftForm 
              is_edit={false} 
              prev={this.prev}
              fetch_collection={`shifts`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'post'}
              submit_url={`/shifts/`}
              current_role={this.props.user.roles[this.props.user.current_role_idx]}
            />
        }
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
const ShiftCreate = connect(
  mapStateToProps
)(getShiftCreate)
export default ShiftCreate
