import routerReducer from './router-reducer';
import userReducer from './user';
import { authStateReducer } from '../redux-auth';
import { combineReducers } from 'redux-immutable';
module.exports = combineReducers({
  auth: authStateReducer,
  routing: routerReducer,
  user: userReducer
});
