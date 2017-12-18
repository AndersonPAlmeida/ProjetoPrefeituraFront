import React, {Component} from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import UserForm from '../../utils/UserForm'

class getProfessionalUserEdit extends Component {
  prev(e) {
    e.preventDefault()
    browserHistory.push(`/professionals/users`)
  }

  render() {
    return (
      <UserForm
        user_class={`citizen`}
        is_edit={false}
        prev={this.prev}
        fetch_collection={`citizens`}
        fetch_params={`permission=${this.props.user.current_role}`}
        fetch_method={'post'}
        submit_url={`/professionals/users`}
      />
    )
  }
}

const mapStateToProps = (state) => {
  const user = state.get('user').getIn(['userInfo'])
  return {
    user
  }
}
const ProfessionalUserEdit = connect(
  mapStateToProps
)(getProfessionalUserEdit)
export default ProfessionalUserEdit


