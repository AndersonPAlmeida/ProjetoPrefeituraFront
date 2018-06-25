import React, {Component} from 'react';
import { Link } from 'react-router';
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux';
import CityHallForm from './CityHallForm';
import { browserHistory } from 'react-router';

class getCityHallCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      city_hall: []
    };
  }

  prev() {
    browserHistory.push(`/city_hall`);
  }

  render() {
    return (
      <div>
        {
          this.state.fetching ? <div /> :
            <CityHallForm
              is_edit={false}
              prev={this.prev}
              fetch_collection={`city_halls`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'post'}
              submit_url={`/city_hall`}
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
const CityHallCreate = connect(
  mapStateToProps
)(getCityHallCreate)
export default CityHallCreate
