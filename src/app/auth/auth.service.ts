import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

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

@Injectable({ providedIn: 'root' })
export class AuthService {
  signupUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  signinURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
  user = new BehaviorSubject<User>(null);
  token: string;

  constructor(private http: HttpClient, private router: Router) {}

  signupUser(email: string, password: string) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(error => console.warn(error));
  }

  signup(email: string, password: string) {
    return (
      this.http
        .post<AuthResponseData>(this.signupUrl + environment.apiKey, {
          email,
          password,
          returnSecureToken: true
        })
        // Same as .pipe(catchError(response => this.handleError(response)));
        // The returned response is automatically passed to referenced function
        .pipe(
          catchError(this.handleError),
          tap(response => {
            this.handleAuthentication(
              response.localId,
              response.email,
              response.idToken,
              // Convert string to number
              +response.expiresIn
            );
          })
        )
    );
  }

  signinUser(email: string, password: string) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        this.router.navigate(['/']);
        firebase
          .auth()
          .currentUser.getIdToken()
          .then((token: string) => (this.token = token));
      })
      .catch(error => console.warn(error));
  }

  signin(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.signinURL + environment.apiKey, {
        email,
        password,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleError),
        tap(response => {
          this.handleAuthentication(
            response.localId,
            response.email,
            response.idToken,
            // Convert string to number
            +response.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: User = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return false;
    }

    const existingUser = new User(
      userData.id,
      userData.email,
      userData._token,
      new Date(userData._tokenExpiration)
    );

    if (existingUser.token) {
      this.user.next(existingUser);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  getToken() {
    firebase
      .auth()
      .currentUser.getIdToken()
      .then((token: string) => (this.token = token));

    return this.token;
  }

  isAuthenticated() {
    return this.token != null;
  }

  private handleAuthentication(id: string, email: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000),
      user = new User(id, email, token, expirationDate);

    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(response: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.';

    if (!response.error || !response.error.error) {
      return throwError(errorMessage);
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

    return throwError(errorMessage);
  }
}
