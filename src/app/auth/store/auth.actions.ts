import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const LOGIN_SUCCESS = '[Auth] Login Success';
export const LOGIN_FAIL = '[Auth] Login Fail';
export const SIGNUP_START = '[Auth] Signup Start';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const LOGOUT = '[Auth] Logout';
export const CLEAR_ERROR = '[Auth] Clear Error';

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: { email: string; password: string }) {}
}
export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(
    public payload: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date;
    }
  ) {}
}

export class LoginFail implements Action {
  readonly type = LOGIN_FAIL;

  constructor(public payload: string) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;

  constructor(public payload: { email: string; password: string }) {}
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export type Actions =
  | LoginStart
  | LoginSuccess
  | LoginFail
  | SignupStart
  | AutoLogin
  | Logout
  | ClearError;
