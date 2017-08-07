export const USER_SIGN_IN = "USER_SIGN_IN";
export const USER_SIGN_OUT = "USER_SIGN_OUT";
export const USER_UPDATE = "USER_UPDATE";

export function userSignIn(user) {
  return { type: USER_SIGN_IN, user };
}

export function userSignOut() {
  return { type: USER_SIGN_OUT };
}

export function userUpdate(data) {
  return { type: USER_UPDATE, data };
}
