import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { authStateReducer } from 'redux-auth';
module.exports = combineReducers({
  auth: authStateReducer,
  routing: routerReducer,
});
