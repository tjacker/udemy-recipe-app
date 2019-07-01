import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable()
// @Injectable({providedIn: 'root'}) // Newer option that doesn't require updating app.module.ts
export class DataService {
  url: string = 'https://udemy-recipe-app-25862.firebaseio.com/recipes.json';

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const token = this.authService.getToken();
    // recipes.json is added to the URL to prevent CORS errors
    this.http.put(this.url + token, this.recipeService.getRecipes()).subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes() {
    // Gets value once and immediately unsubscribes
    // exhaustMap waits for first user observable to complete
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http.get<Recipe[]>(this.url, {
          params: new HttpParams().set('auth', user.token)
        });
      }),
      // First map is the rxjs operator; second is array method
      map(recipes => {
        return recipes.map(recipe => {
          return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
