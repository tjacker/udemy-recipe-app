import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import { Recipe } from './recipe.model';
import * as RecipeActions from './store/recipe.actions';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<{ recipes: Recipe[] }> {
  constructor(private store: Store<fromApp.AppState>, private actions$: Actions) {}

  resolve() {
    return this.store.select('recipes').pipe(
      first(),
      map(recipesState => recipesState.recipes),
      switchMap(recipes => {
        if (!recipes.length) {
          this.store.dispatch(RecipeActions.fetchRecipes());
          return this.actions$.pipe(ofType(RecipeActions.setRecipes), first());
        } else {
          return of({ recipes });
        }
      })
    );
  }
}
