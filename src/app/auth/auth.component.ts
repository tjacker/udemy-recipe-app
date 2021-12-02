import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const { email, password } = form.value;
    let authObservable: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObservable = this.authService.signin(email, password);
    } else {
      authObservable = this.authService.signup(email, password);
    }

    authObservable.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        // Forward user to recipes router after successfully logging in
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.warn(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }
}
