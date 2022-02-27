import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import firebase from 'firebase/app';
import 'firebase/auth';
import { environment } from './../environments/environment';
import { AuthService } from './auth/auth.service';
import * as AuthActions from './auth/store/auth.actions';
import * as fromApp from './store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    // this.authService.autoLogin();
    this.store.dispatch(new AuthActions.AutoLogin());
    firebase.initializeApp(environment.firebaseConfig);
  }
}
