import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { environment } from 'src/environments/environment';

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
export class AuthService {
  signupUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=';
  signinURL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=';
  token: string;
  // FIXME: remove this after refactoring
  router: any;

  constructor(private http: HttpClient) {}

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
        .pipe(catchError(this.handleError))
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
      .pipe(catchError(this.handleError));
  }

  logout() {
    firebase.auth().signOut;
    this.token = null;
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
