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

export function authReducer(state: AuthState = initialState, action: AuthActions.Actions) {
  switch (action.type) {
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        authError: null,
        isLoading: true,
      };
    case AuthActions.LOGIN_SUCCESS:
      const { userId, email, token, expirationDate } = action.payload;
      const user = new User(userId, email, token, expirationDate);

      return {
        ...state,
        user,
        authError: null,
        isLoading: false,
      };
    case AuthActions.LOGIN_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        isLoading: false,
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
        authError: null,
        isLoading: false,
      };
    default:
      return state;
  }
}
