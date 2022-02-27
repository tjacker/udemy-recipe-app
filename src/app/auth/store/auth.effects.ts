import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
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

@Injectable()
export class AuthEffects {
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((AuthData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(environment.signinURL + environment.apiKey, {
          email: AuthData.payload.email,
          password: AuthData.payload.password,
          returnSecureToken: true,
        })
        .pipe(
          map(response => {
            const { localId: userId, email, idToken: token } = response;
            const expirationDate = new Date(new Date().getTime() + +response.expiresIn * 1000);

            return new AuthActions.LoginSuccess({ userId, email, token, expirationDate });
          }),
          catchError(response => {
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
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN_SUCCESS),
    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}
}
