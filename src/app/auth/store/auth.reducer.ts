import { createReducer, on } from '@ngrx/store';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User;
  authError: string;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  authError: null,
  isLoading: false,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginStart, AuthActions.signupStart, state => ({
    ...state,
    authError: null,
    isLoading: true,
  })),
  on(AuthActions.loginSuccess, (state, { userId, email, token, expirationDate }) => ({
    ...state,
    user: new User(userId, email, token, expirationDate),
    authError: null,
    isLoading: false,
  })),
  on(AuthActions.loginFail, (state, { authError }) => ({
    ...state,
    user: null,
    authError,
    isLoading: false,
  })),
  on(AuthActions.logout, state => ({
    ...state,
    user: null,
    authError: null,
    isLoading: false,
  })),
  on(AuthActions.clearError, state => ({
    ...state,
    authError: null,
  }))
);
