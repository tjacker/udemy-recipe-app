import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import * as AuthActions from '../auth/store/auth.actions';
import * as fromAuth from '../auth/store/auth.reducer';
import { DataService } from '../shared/data.service';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  private userSubscription: Subscription;
  isAuthenticated = false;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.userSubscription = this.store
      .select('auth')
      .pipe(map((authState: fromAuth.AuthState) => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !!user;
      });

    // this.userSubscription = this.authService.user.subscribe(user => {
    //   this.isAuthenticated = !!user;
    // });
  }

  onSaveData() {
    this.dataService.storeRecipes();
  }

  onFetchData() {
    this.dataService.fetchRecipes().subscribe();
  }

  onLogout() {
    // this.authService.logout();
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
