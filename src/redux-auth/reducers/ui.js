/*
 * This file is part of Agendador.
 *
 * Agendador is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Agendador is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Agendador.  If not, see <https://www.gnu.org/licenses/>.
 */

import Immutable from "immutable";
import { createReducer } from "redux-immutablejs";
import * as uiActions from "../actions/ui";
import * as emailSignInActions from "../actions/email-sign-in";
import * as emailSignUpActions from "../actions/email-sign-up";
import * as signOutActions from "../actions/sign-out";
import * as requestPasswordResetActions from "../actions/request-password-reset";
import * as oAuthSignInActions from "../actions/oauth-sign-in";
import * as updatePasswordActions from "../actions/update-password";
import * as destroyAccountActions from "../actions/destroy-account";
import * as updatePasswordModalActions from "../actions/update-password-modal";
import * as serverActions from "../actions/server";

const initialState = Immutable.fromJS({
  emailSignInSuccessModalVisible:          false,
  emailSignInErrorModalVisible:            false,
  oAuthSignInSuccessModalVisible:          false,
  oAuthSignInErrorModalVisible:            false,
  oAuthSignInLoadingProvider:              null,
  signOutSuccessModalVisible:              false,
  signOutErrorModalVisible:                false,
  emailSignUpSuccessModalVisible:          false,
  emailSignUpAddress:                      null,
  firstTimeLoginSuccessModalVisible:       false,
  firstTimeLoginErrorModalVisible:         false,
  requestPasswordResetSuccessModalVisible: false,
  requestPasswordResetErrorModalVisible:   false,
  requestPasswordResetSuccessMessage:      null,
  updatePasswordSuccessModalVisible:       false,
  updatePasswordErrorModalVisible:         false,
  destroyAccountSuccessModalVisible:       false,
  destroyAccountErrorModalVisible:         false,
  destroyAccountMessage:                   null,
  passwordResetSuccessModalVisible:        false,
  passwordResetErrorModalVisible:          false
});

export default createReducer(initialState, {
  [emailSignInActions.EMAIL_SIGN_IN_COMPLETE]: state => {
    $("#toast-container").remove();
    Materialize.toast("Bem vindo.", 10000, "green",function(){$("#toast-container").remove()});
    return state;
  },

  [emailSignInActions.EMAIL_SIGN_IN_ERROR]: state => {
    $("#toast-container").remove();
    Materialize.toast("Erro ao realizar login.", 10000, "red",function(){$("#toast-container").remove()});
    return state;
  },

  [oAuthSignInActions.OAUTH_SIGN_IN_COMPLETE]: state => state.merge({
    oAuthSignInSuccessModalVisible: true,
    oAuthSignInLoadingProvider: null
  }),

  [oAuthSignInActions.OAUTH_SIGN_IN_ERROR]: state => state.merge({
    oAuthSignInErrorModalVisible: true,
    oAuthSignInLoadingProvider: null
  }),

  [oAuthSignInActions.OAUTH_SIGN_IN_START]: (state, { provider }) => state.merge({
    oAuthSignInLoadingProvider: provider
  }),

  [uiActions.HIDE_EMAIL_SIGN_IN_SUCCESS_MODAL]: state => state.set(
    "emailSignInSuccessModalVisible", false
  ),

  [uiActions.HIDE_EMAIL_SIGN_IN_ERROR_MODAL]: state => state.set(
    "emailSignInErrorModalVisible", false
  ),


  [signOutActions.SIGN_OUT_ERROR]: state => {
    return state;
  },

  [signOutActions.SIGN_OUT_COMPLETE]: state => {
    return state;
  },

  [uiActions.HIDE_SIGN_OUT_SUCCESS_MODAL]: state => state.set(
    "signOutSuccessModalVisible", false
  ),

  [uiActions.HIDE_SIGN_OUT_ERROR_MODAL]: state => state.set(
    "signOutErrorModalVisible", false
  ),

  [emailSignUpActions.EMAIL_SIGN_UP_COMPLETE]: (state, {user}) => {
    Materialize.toast("Registrado com sucesso.", 10000, "green",function(){$("#toast-container").remove()});
    emailSignUpAddress: user.email
    return state;
  },

  [emailSignUpActions.EMAIL_SIGN_UP_ERROR]: state => {
    return state;
  },

  [emailSignUpActions.SIGN_UP_CEP_COMPLETE]: (state) => {
    $("#toast-container").remove();
    Materialize.toast("CEP válido.", 10000, "green",function(){$("#toast-container").remove()});
    return state;
  },

  [emailSignUpActions.SIGN_UP_CEP_ERROR]: state => {
    $("#toast-container").remove();
    Materialize.toast("CEP inválido.", 10000, "red",function(){$("#toast-container").remove()});
    return state;
  },

  [uiActions.HIDE_EMAIL_SIGN_UP_SUCCESS_MODAL]: state => state.merge({
    emailSignUpAddress: null
  }),

  [uiActions.HIDE_EMAIL_SIGN_UP_ERROR_MODAL]: state => state.set(
    "emailSignUpErrorModalVisible", false
  ),

  [uiActions.SHOW_FIRST_TIME_LOGIN_SUCCESS_MODAL]: state => state.set(
    "firstTimeLoginSuccessModalVisible", true
  ),

  [uiActions.HIDE_FIRST_TIME_LOGIN_SUCCESS_MODAL]: state => state.set(
    "firstTimeLoginSuccessModalVisible", false
  ),

  [uiActions.HIDE_PASSWORD_RESET_SUCCESS_MODAL]: state => state.set(
    "passwordResetSuccessModalVisible", false
  ),

  [uiActions.SHOW_PASSWORD_RESET_SUCCESS_MODAL]: state => state.set(
    "passwordResetSuccessModalVisible", true
  ),

  [uiActions.SHOW_FIRST_TIME_LOGIN_ERROR_MODAL]: state => state.set(
    "firstTimeLoginErrorModalVisible", true
  ),

  [uiActions.HIDE_FIRST_TIME_LOGIN_ERROR_MODAL]: state => state.set(
    "firstTimeLoginErrorModalVisible", false
  ),

  [uiActions.HIDE_PASSWORD_RESET_ERROR_MODAL]: state => state.set(
    "passwordResetErrorModalVisible", false
  ),

  [uiActions.SHOW_PASSWORD_RESET_ERROR_MODAL]: state => state.set(
    "passwordResetErrorModalVisible", true
  ),

  [requestPasswordResetActions.REQUEST_PASSWORD_RESET_COMPLETE]: (state, {message}) => {
    return state.merge({
      requestPasswordResetSuccessModalVisible: true,
      requestPasswordResetSuccessMessage: message
    });
  },

  [requestPasswordResetActions.REQUEST_PASSWORD_RESET_ERROR]: state => state.set(
    "requestPasswordResetErrorModalVisible", true
  ),

  [uiActions.HIDE_REQUEST_PASSWORD_RESET_SUCCESS_MODAL]: state => state.merge({
    requestPasswordResetSuccessModalVisible: false,
    requestPasswordResetSuccessMessage: null
  }),

  [uiActions.HIDE_REQUEST_PASSWORD_RESET_ERROR_MODAL]: state => state.set(
    "requestPasswordResetErrorModalVisible", false
  ),

  [uiActions.HIDE_OAUTH_SIGN_IN_SUCCESS_MODAL]: state => state.set(
    "oAuthSignInSuccessModalVisible", false
  ),

  [uiActions.HIDE_OAUTH_SIGN_IN_ERROR_MODAL]: state => state.set(
    "oAuthSignInErrorModalVisible", false
  ),

  [updatePasswordActions.UPDATE_PASSWORD_COMPLETE]: state => state.set(
    "updatePasswordSuccessModalVisible", true
  ),

  [updatePasswordActions.UPDATE_PASSWORD_ERROR]: state => state.set(
    "updatePasswordErrorModalVisible", true
  ),

  [uiActions.HIDE_UPDATE_PASSWORD_SUCCESS_MODAL]: state => state.set(
    "updatePasswordSuccessModalVisible", false
  ),

  [uiActions.HIDE_UPDATE_PASSWORD_ERROR_MODAL]: state => state.set(
    "updatePasswordErrorModalVisible", false
  ),

  [destroyAccountActions.DESTROY_ACCOUNT_COMPLETE]: (state, { message }) => state.merge({
    destroyAccountSuccessModalVisible: true,
    destroyAccountMessage: message
  }),

  [destroyAccountActions.DESTROY_ACCOUNT_ERROR]: state => state.set(
    "destroyAccountErrorModalVisible", true
  ),

  [uiActions.HIDE_DESTROY_ACCOUNT_SUCCESS_MODAL]: state => state.merge({
    destroyAccountSuccessModalVisible: false,
    destroyAccountMessage: null
  }),

  [uiActions.HIDE_DESTROY_ACCOUNT_ERROR_MODAL]: state => state.set(
    "destroyAccountErrorModalVisible", false
  ),

  [serverActions.SS_AUTH_TOKEN_UPDATE]: (state, {mustResetPassword, firstTimeLogin}) => state.merge({
    passwordResetSuccessModalVisible: mustResetPassword,
    firstTimeLoginSuccessModalVisible: firstTimeLogin
  }),

  [uiActions.HIDE_PASSWORD_RESET_SUCCESS_MODAL]: state => state.set(
    "passwordResetSuccessModalVisible", false
  ),

  [uiActions.HIDE_PASSWORD_RESET_ERROR_MODAL]: state => state.set(
    "passwordResetSuccessModalVisible", false
  ),

  [updatePasswordModalActions.UPDATE_PASSWORD_MODAL_COMPLETE]: state => state.merge({
    passwordResetSuccessModalVisible: false,
    updatePasswordSuccessModalVisible: true
  })
});
