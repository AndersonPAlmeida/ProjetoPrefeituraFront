import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import SectorForm from './SectorForm'
import { browserHistory } from 'react-router';

function findRole(roles, current_role_idx) { 
  var i;
  for(var i = 0; i < roles.length; i++) {
    if(roles[i].id = current_role_idx)
      return i;
  }
}

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
              city_hall_id={this.props.user.roles[findRole(this.props.user.roles, this.props.user.current_role)].city_hall_id}
            />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  const current_role_idx = user.roles.find( (role) => { role.id == user.current_role } )
  console.log(current_role_idx)
  return {
    user
  }
}
const SectorCreate = connect(
  mapStateToProps
)(getSectorCreate)
export default SectorCreate
