import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  // Returned from signin response, but not signup
  registered?: boolean;
}

const handlePost = (
  authData: AuthActions.LoginStart | AuthActions.SignupStart,
  http: HttpClient,
  url: string
): Observable<AuthResponseData> => {
  const { email, password } = authData.payload;

  return http.post<AuthResponseData>(url + environment.apiKey, {
    email,
    password,
    returnSecureToken: true,
  });
};

const handleAuthentication = (response: AuthResponseData) => {
  const { localId: userId, email, idToken: token } = response;
  const expirationDate = new Date(new Date().getTime() + +response.expiresIn * 1000);

  return new AuthActions.LoginSuccess({ userId, email, token, expirationDate });
};

const handleError = (response: any) => {
  let errorMessage = 'An unknown error occurred.';

  if (!response.error || !response.error.error) {
    return of(new AuthActions.LoginFail(errorMessage));
  }

  switch (response.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email already exists.';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'Email address does not exist.';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'The password entered was incorrect.';
      break;
  }
  return of(new AuthActions.LoginFail(errorMessage));
};

@Injectable()
export class AuthEffects {
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return handlePost(authData, this.http, environment.signinUrl).pipe(
        map((response: AuthResponseData) => handleAuthentication(response)),
        catchError(response => handleError(response))
      );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.LOGIN_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.router.navigate(['/auth']);
    })
  );

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupData: AuthActions.SignupStart) => {
      return handlePost(signupData, this.http, environment.signupUrl).pipe(
        map((response: AuthResponseData) => handleAuthentication(response)),
        catchError(response => handleError(response))
      );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}
}
