import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AlertContainerDirective } from '../shared/alert/alert-container.directive';
import { AlertComponent } from '../shared/alert/alert.component';
import * as fromApp from '../store/app.reducer';
import { AuthResponseData, AuthService } from './auth.service';
import * as AuthActions from './store/auth.actions';
import * as fromAuth from './store/auth.reducer';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  authError: string = null;

  private closeAlertSubscription: Subscription;

  @ViewChild(AlertContainerDirective, { static: false }) alertHost: AlertContainerDirective;

  constructor(
    private authService: AuthService,
    // private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store.select('auth').subscribe((authState: fromAuth.AuthState) => {
      this.isLoading = authState.isLoading;
      this.authError = authState.authError;
      if (this.authError) {
        this.showErrorAlert(this.authError);
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const { email, password } = form.value;
    let authObservable: Observable<AuthResponseData>;

    // this.isLoading = true;
    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({ email, password }));
      // authObservable = this.authService.signin(email, password);
    } else {
      authObservable = this.authService.signup(email, password);
    }

    // authObservable.subscribe(
    //   resData => {
    //     this.isLoading = false;
    //     // Forward user to recipes router after successfully logging in
    //     this.router.navigate(['/recipes']);
    //   },
    //   errorMessage => {
    //     console.warn(errorMessage);
    //     this.error = errorMessage;
    //     this.showErrorAlert(errorMessage);
    //     this.isLoading = false;
    //   }
    // );

    form.reset();
  }

  onHandleError() {
    this.authError = null;
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
