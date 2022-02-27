import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { exhaustMap, first, map } from 'rxjs/operators';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromApp from '../store/app.reducer';
import { User } from './user.model';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Gets value once and immediately unsubscribes
    // exhaustMap waits for first user observable to complete
    return this.store.select('auth').pipe(
      map((authState: fromAuth.AuthState) => authState.user),
      first(),
      exhaustMap((user: User) => {
        // If user does not exist, pass request to next handler
        if (!user) {
          return next.handle(req);
        }

        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
