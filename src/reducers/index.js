import routerReducer from './router-reducer';
import { authStateReducer } from '../redux-auth';
import { combineReducers } from 'redux-immutable';
module.exports = combineReducers({
  auth: authStateReducer,
  routing: routerReducer
});
