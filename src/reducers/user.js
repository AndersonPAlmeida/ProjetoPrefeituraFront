import Immutable from 'immutable';
import {
  USER_SIGN_IN,
  USER_SIGN_OUT,
  USER_UPDATE
} from '../actions/user';

const initialUser = { 
                      userInfo: { 
                        citizen: { 
                                   id: 0,
                                   address_complement: '',
                                   address_number: '',
                                   birth_date: '',
                                   cep: '',
                                   cpf: '',
                                   email: '',
                                   name: '',
                                   note: '',
                                   pcd: '',
                                   phone1: '',
                                   phone2: '',
                                   rg: '',
                                   city: { 
                                           id: 0, 
                                           name: '' 
                                         } 
                                 }, 
                        current_role: 'citizen',
                        current_role_idx: -1, 
                        roles: [] 
                      } 
                    }
const initialState = Immutable.Map(initialUser)

const userReducer = (state = initialState, action) => {
  if (action.type === USER_SIGN_IN) {
    action.user.current_role = "citizen";
    action.user.current_role_idx = -1;
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
