import { routerReducer } from 'react-router-redux';
import { authStateReducer } from 'redux-auth';
import { combineReducers } from 'redux';
module.exports = combineReducers({
  auth: authStateReducer,
  routing: routerReducer,
});
