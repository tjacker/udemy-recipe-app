import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthResponseData } from '../auth-response.model';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';
import { AuthData } from './auth.model';

@Injectable()
export class AuthEffects {
  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap((authData: AuthData) => {
        return this.handlePost(authData, environment.signinUrl).pipe(
          tap(response => this.authService.setLogoutTimer(+response.expiresIn * 1000)),
          map((response: AuthResponseData) => this.handleAuthentication(response)),
          catchError(response => this.handleError(response))
        );
      })
    )
  );

  authRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(authActionsSuccess => {
          if (authActionsSuccess.redirect) {
            this.router.navigate(['/']);
          }
        })
      ),
    { dispatch: false }
  );

  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      switchMap((signupData: AuthData) => {
        return this.handlePost(signupData, environment.signupUrl).pipe(
          tap(response => this.authService.setLogoutTimer(+response.expiresIn * 1000)),
          map((response: AuthResponseData) => this.handleAuthentication(response)),
          catchError(response => this.handleError(response))
        );
      })
    )
  );

  authAutoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const userData: User = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          // Return a non-existent action to exit effect
          return { type: 'FAKE' };
        }

        const expirationDate = new Date(userData._tokenExpiration);
        const existingUser = new User(userData.id, userData.email, userData._token, expirationDate);

        if (existingUser.token) {
          const { id: userId, email, token } = existingUser;
          const expirationDuration =
            new Date(userData._tokenExpiration).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          return AuthActions.loginSuccess({
            userId,
            email,
            token,
            expirationDate,
            redirect: false,
          });
        }
        return { type: 'FAKE' };
      })
    )
  );

  authLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  private handlePost = (authData: AuthData, url: string): Observable<AuthResponseData> => {
    const { email, password } = authData;

    return this.http.post<AuthResponseData>(url + environment.apiKey, {
      email,
      password,
      returnSecureToken: true,
    });
  };

  private handleAuthentication = (response: AuthResponseData) => {
    const { localId: userId, email, idToken: token } = response;
    const expirationDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
    const user = new User(userId, email, token, expirationDate);

    localStorage.setItem('userData', JSON.stringify(user));

    return AuthActions.loginSuccess({ userId, email, token, expirationDate, redirect: true });
  };

  private handleError = (response: any) => {
    let authError = 'An unknown error occurred.';

    if (!response.error || !response.error.error) {
      return of(AuthActions.loginFail({ authError }));
    }

    switch (response.error.error.message) {
      case 'EMAIL_EXISTS':
        authError = 'This email already exists.';
        break;
      case 'EMAIL_NOT_FOUND':
        authError = 'Email address does not exist.';
        break;
      case 'INVALID_PASSWORD':
        authError = 'The password entered was incorrect.';
        break;
    }
    return of(AuthActions.loginFail({ authError }));
  };
}
