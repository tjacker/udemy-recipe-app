import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertContainerDirective } from '../shared/alert/alert-container.directive';
import { AlertComponent } from '../shared/alert/alert.component';
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

  private closeAlertSubscription: Subscription;

  @ViewChild(AlertContainerDirective, { static: false }) alertHost: AlertContainerDirective;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

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
        this.isLoading = false;
        // Forward user to recipes router after successfully logging in
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.warn(errorMessage);
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  private showErrorAlert(message: string) {
    const alertComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;

    hostViewContainerRef.clear();

    const alertComponentRef = hostViewContainerRef.createComponent(alertComponentFactory);

    alertComponentRef.instance.message = message;

    this.closeAlertSubscription = alertComponentRef.instance.close.subscribe(() => {
      this.closeAlertSubscription.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
