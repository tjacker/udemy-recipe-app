import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthResponseData } from '../auth-response.model';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.handlePost(authData, environment.signinUrl).pipe(
        tap(response => this.authService.setLogoutTimer(+response.expiresIn * 1000)),
        map((response: AuthResponseData) => this.handleAuthentication(response)),
        catchError(response => this.handleError(response))
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

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupData: AuthActions.SignupStart) => {
      return this.handlePost(signupData, environment.signupUrl).pipe(
        tap(response => this.authService.setLogoutTimer(+response.expiresIn * 1000)),
        map((response: AuthResponseData) => this.handleAuthentication(response)),
        catchError(response => this.handleError(response))
      );
    })
  );

  @Effect()
  authAuthLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
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
        // this.user.next(existingUser);
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.LoginSuccess({ userId, email, token, expirationDate });
        // this.store.dispatch(new AuthActions.LoginSuccess({ userId, email, token, expirationDate }));
        // this.autoLogout(expirationDuration);
      }

      return { type: 'FAKE' };
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  private handlePost = (
    authData: AuthActions.LoginStart | AuthActions.SignupStart,
    url: string
  ): Observable<AuthResponseData> => {
    const { email, password } = authData.payload;

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

    return new AuthActions.LoginSuccess({ userId, email, token, expirationDate });
  };

  private handleError = (response: any) => {
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
}
