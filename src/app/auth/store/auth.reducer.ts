import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User;
}

const initialState: AuthState = {
  user: null,
};

export function authReducer(state: AuthState = initialState, action: AuthActions.Actions) {
  switch (action.type) {
    case AuthActions.LOGIN:
      const { userId, email, token, expirationDate } = action.payload;
      const user = new User(userId, email, token, expirationDate);

      return {
        ...state,
        user,
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}
