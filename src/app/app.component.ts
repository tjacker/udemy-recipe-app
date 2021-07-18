import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';

import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit() {
    firebase.initializeApp(environment.firebaseConfig);
  }
}
