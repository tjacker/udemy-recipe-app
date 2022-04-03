import { createAction, props } from '@ngrx/store';

export const loginStart = createAction(
  '[Auth] Login Start',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ userId: string; email: string; token: string; expirationDate: Date; redirect: boolean }>()
);

export const loginFail = createAction('[Auth] Login Fail', props<{ authError: string }>());

export const signupStart = createAction(
  '[Auth] Signup Start',
  props<{ email: string; password: string }>()
);

export const autoLogin = createAction('[Auth] Auto Login');

export const logout = createAction('[Auth] Logout');

export const clearError = createAction('[Auth] Clear Error');
