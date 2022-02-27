import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  // ! COMPONENT NO LONGER IN USE
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSignin(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    // Firebase will automatically store token in indexedDB
    this.authService.signinUser(email, password);
    form.reset();
  }
}
