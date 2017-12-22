import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import ShiftForm from './ShiftForm'
import { browserHistory } from 'react-router';

class getShiftEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shift: [],
      fetching: true
    };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `shifts/${this.props.params.shift_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ shift: resp, fetching: false })
    });
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
              data={this.state.shift} 
              is_edit={true} 
              prev={this.prev}
              fetch_collection={`shifts/${this.props.params.shift_id}`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'put'}
              current_role={this.props.user.roles[this.props.user.current_role_idx]}
              submit_url={`/shifts/`}
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
const ShiftEdit = connect(
  mapStateToProps
)(getShiftEdit)
export default ShiftEdit
