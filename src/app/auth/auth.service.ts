import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { environment } from 'src/environments/environment';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable()
export class AuthService {
  signupUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=';
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
    console.log(email, password, environment.apiKey);
    return this.http
      .post<AuthResponseData>(this.signupUrl + environment.apiKey, {
        email,
        password,
        returnSecureToken: true
      })
      .pipe(
        catchError(response => {
          let errorMessage = 'An unknown error occurred.';

          if (!response.error || !response.error.error) {
            return throwError(errorMessage);
          }

          switch (response.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'This email already exists.';
          }

          return throwError(errorMessage);
        })
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
}
