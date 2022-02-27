import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromApp from '../store/app.reducer';
import { User } from './user.model';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store<fromApp.AppState>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.store.select('auth').pipe(
      first(),
      map((authState: fromAuth.AuthState) => authState.user),
      map((user: User) => {
        const isAuth = !!user;

        if (isAuth) {
          return true;
        }

        return this.router.createUrlTree(['/auth']);
      })
    );
  }
}
