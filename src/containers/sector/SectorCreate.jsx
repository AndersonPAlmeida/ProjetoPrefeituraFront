import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import SectorForm from './SectorForm'
import { browserHistory } from 'react-router';

class getSectorCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sector: []
    };
  }

  prev() {
    browserHistory.push(`/sectors`)
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> : 
            <SectorForm 
              user_class={`sector`}
              is_edit={false} 
              prev={this.prev}
              fetch_collection={`sectors`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'post'}
              submit_url={`/sectors/`}
              city_hall_id={this.props.user.roles}
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
const SectorCreate = connect(
  mapStateToProps
)(getSectorCreate)
export default SectorCreate
