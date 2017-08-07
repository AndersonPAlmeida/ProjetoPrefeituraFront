import Immutable from 'immutable';
import {
  USER_SIGN_IN,
  USER_SIGN_OUT,
  USER_UPDATE
} from '../actions/user';

const initialState = Immutable.fromJS({
  userInfo: null
});

const userReducer = (state = initialState, action) => {
  if (action.type === USER_SIGN_IN) {
    return state.set('userInfo', action.user);
  }

  if (action.type === USER_SIGN_OUT) {
    return state.set('userInfo', null);
  }

  if (action.type === USER_UPDATE) {
    return state.set('userInfo', Object.assign(state.get('userInfo'),action.data));
  }

  return state;
};

export default userReducer;
