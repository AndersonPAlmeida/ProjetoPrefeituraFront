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

export const HIDE_EMAIL_SIGN_IN_SUCCESS_MODAL          = "HIDE_EMAIL_SIGN_IN_SUCCESS_MODAL";
export const HIDE_EMAIL_SIGN_IN_ERROR_MODAL            = "HIDE_EMAIL_SIGN_IN_ERROR_MODAL";
export const HIDE_OAUTH_SIGN_IN_SUCCESS_MODAL          = "HIDE_OAUTH_SIGN_IN_SUCCESS_MODAL";
export const HIDE_OAUTH_SIGN_IN_ERROR_MODAL            = "HIDE_OAUTH_SIGN_IN_ERROR_MODAL";
export const HIDE_SIGN_OUT_ERROR_MODAL                 = "HIDE_SIGN_OUT_ERROR_MODAL";
export const HIDE_SIGN_OUT_SUCCESS_MODAL               = "HIDE_SIGN_OUT_SUCCESS_MODAL";
export const HIDE_EMAIL_SIGN_UP_SUCCESS_MODAL          = "HIDE_EMAIL_SIGN_UP_SUCCESS_MODAL";
export const HIDE_EMAIL_SIGN_UP_ERROR_MODAL            = "HIDE_EMAIL_SIGN_UP_ERROR_MODAL";
export const SHOW_FIRST_TIME_LOGIN_SUCCESS_MODAL       = "SHOW_FIRST_TIME_LOGIN_SUCCESS_MODAL";
export const HIDE_FIRST_TIME_LOGIN_SUCCESS_MODAL       = "HIDE_FIRST_TIME_LOGIN_SUCCESS_MODAL";
export const HIDE_PASSWORD_RESET_SUCCESS_MODAL         = "HIDE_PASSWORD_RESET_SUCCESS_MODAL";
export const SHOW_PASSWORD_RESET_SUCCESS_MODAL         = "SHOW_PASSWORD_RESET_SUCCESS_MODAL";
export const SHOW_FIRST_TIME_LOGIN_ERROR_MODAL         = "SHOW_FIRST_TIME_LOGIN_ERROR_MODAL";
export const HIDE_FIRST_TIME_LOGIN_ERROR_MODAL         = "HIDE_FIRST_TIME_LOGIN_ERROR_MODAL";
export const HIDE_PASSWORD_RESET_ERROR_MODAL           = "HIDE_PASSWORD_RESET_ERROR_MODAL";
export const SHOW_PASSWORD_RESET_ERROR_MODAL           = "SHOW_PASSWORD_RESET_ERROR_MODAL";
export const HIDE_REQUEST_PASSWORD_RESET_SUCCESS_MODAL = "HIDE_REQUEST_PASSWORD_RESET_SUCCESS_MODAL";
export const HIDE_REQUEST_PASSWORD_RESET_ERROR_MODAL   = "HIDE_REQUEST_PASSWORD_RESET_ERROR_MODAL";
export const HIDE_UPDATE_PASSWORD_SUCCESS_MODAL        = "HIDE_UPDATE_PASSWORD_SUCCESS_MODAL";
export const HIDE_UPDATE_PASSWORD_ERROR_MODAL          = "HIDE_UPDATE_PASSWORD_ERROR_MODAL";
export const HIDE_DESTROY_ACCOUNT_SUCCESS_MODAL        = "HIDE_DESTROY_ACCOUNT_SUCCESS_MODAL";
export const HIDE_DESTROY_ACCOUNT_ERROR_MODAL          = "HIDE_DESTROY_ACCOUNT_ERROR_MODAL";


export function hideEmailSignInSuccessModal() {
  return { type: HIDE_EMAIL_SIGN_IN_SUCCESS_MODAL };
}
export function hideEmailSignInErrorModal() {
  return { type: HIDE_EMAIL_SIGN_IN_ERROR_MODAL };
}
export function hideOAuthSignInSuccessModal() {
  return { type: HIDE_OAUTH_SIGN_IN_SUCCESS_MODAL };
}
export function hideOAuthSignInErrorModal() {
  return { type: HIDE_OAUTH_SIGN_IN_ERROR_MODAL };
}
export function hideSignOutSuccessModal() {
  return { type: HIDE_SIGN_OUT_SUCCESS_MODAL };
}
export function hideSignOutErrorModal() {
  return { type: HIDE_SIGN_OUT_ERROR_MODAL };
}
export function hideEmailSignUpSuccessModal() {
  return { type: HIDE_EMAIL_SIGN_UP_SUCCESS_MODAL };
}
export function hideEmailSignUpErrorModal() {
  return { type: HIDE_EMAIL_SIGN_UP_ERROR_MODAL };
}
export function showFirstTimeLoginSuccessModal() {
  return { type: SHOW_FIRST_TIME_LOGIN_SUCCESS_MODAL };
}
export function showPasswordResetSuccessModal() {
  return { type: SHOW_PASSWORD_RESET_SUCCESS_MODAL };
}
export function hideFirstTimeLoginSuccessModal() {
  return { type: HIDE_FIRST_TIME_LOGIN_SUCCESS_MODAL };
}
export function hidePasswordResetSuccessModal() {
  return { type: HIDE_PASSWORD_RESET_SUCCESS_MODAL };
}
export function showFirstTimeLoginErrorModal() {
  return { type: SHOW_FIRST_TIME_LOGIN_ERROR_MODAL };
}
export function showPasswordResetErrorModal() {
  return { type: SHOW_PASSWORD_RESET_ERROR_MODAL };
}
export function hideFirstTimeLoginErrorModal() {
  return { type: HIDE_FIRST_TIME_LOGIN_ERROR_MODAL };
}
export function hidePasswordResetErrorModal() {
  return { type: HIDE_PASSWORD_RESET_ERROR_MODAL };
}
export function hidePasswordResetRequestSuccessModal() {
  return { type: HIDE_REQUEST_PASSWORD_RESET_SUCCESS_MODAL };
}
export function hidePasswordResetRequestErrorModal() {
  return { type: HIDE_REQUEST_PASSWORD_RESET_ERROR_MODAL };
}
export function hideUpdatePasswordSuccessModal() {
  return { type: HIDE_UPDATE_PASSWORD_SUCCESS_MODAL };
}
export function hideUpdatePasswordErrorModal() {
  return { type: HIDE_UPDATE_PASSWORD_ERROR_MODAL };
}
export function hideDestroyAccountSuccessModal() {
  return { type: HIDE_DESTROY_ACCOUNT_SUCCESS_MODAL };
}
export function hideDestroyAccountErrorModal() {
  return { type: HIDE_DESTROY_ACCOUNT_ERROR_MODAL };
}
