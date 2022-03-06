import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import firebase from 'firebase/app';
import 'firebase/auth';
import { environment } from './../environments/environment';
import * as AuthActions from './auth/store/auth.actions';
import * as fromApp from './store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.dispatch(AuthActions.autoLogin());
    firebase.initializeApp(environment.firebaseConfig);
  }
}
