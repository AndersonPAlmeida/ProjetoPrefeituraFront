import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import OccupationForm from './OccupationForm'
import { browserHistory } from 'react-router';

class getOccupationCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      occupation: []
    };
  }

  prev() {
    browserHistory.push(`/occupations`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> :
            <OccupationForm
              is_edit={false}
              prev={this.prev}
              fetch_collection={`occupations`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'post'}
              submit_url={`/occupations/`}
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
const OccupationCreate = connect(
  mapStateToProps
)(getOccupationCreate)
export default OccupationCreate