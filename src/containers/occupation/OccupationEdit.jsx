import React, {Component} from 'react'
import { Link } from 'react-router'
import { port, apiHost, apiPort, apiVer } from '../../../config/env';
import {parseResponse} from "../../redux-auth/utils/handle-fetch-response";
import {fetch} from "../../redux-auth";
import { connect } from 'react-redux'
import OccupationForm from './OccupationForm'
import { browserHistory } from 'react-router';

class getOccupationEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      occupation: [],
      fetching: true
    };
  }

  componentDidMount() {
    var self = this;
    const apiUrl = `http://${apiHost}:${apiPort}/${apiVer}`;
    const collection = `occupations/${this.props.params.occupation_id}`;
    const params = `permission=${this.props.user.current_role}`
    fetch(`${apiUrl}/${collection}?${params}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json" },
        method: "get",
    }).then(parseResponse).then(resp => {
      self.setState({ occupation: resp, fetching: false }, () => console.log(this.state))
    });
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
              data={this.state.occupation}
              is_edit={true}
              prev={this.prev}
              fetch_collection={`occupations/${this.props.params.occupation_id}`}
              fetch_params={`permission=${this.props.user.current_role}`}
              fetch_method={'put'}
              current_role={this.props.user.roles[this.props.user.current_role_idx]}
              submit_url={`/occupations/`}
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
const OccupationEdit = connect(
  mapStateToProps
)(getOccupationEdit)
export default OccupationEdit
