import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  link: string = 'recipes';

  ngOnInit() {
    firebase.initializeApp(environment.firebaseConfig);
  }

  onNavigate(link: string) {
    this.link = link;
  }
}
