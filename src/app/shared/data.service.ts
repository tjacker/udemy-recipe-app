import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable()
// @Injectable({providedIn: 'root'}) // Newer option that doesn't require updating app.module.ts
export class DataService {
  url: string = 'https://udemy-recipe-app-595f4.firebaseio.com/recipes.json?auth=';

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
    const token = this.authService.getToken();
    this.http
      .get<Recipe[]>(this.url + token)
      .pipe(
        // First map is the rxjs operator; second is array method
        map(recipes => {
          return recipes.map(recipe => {
            return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
          });
        })
      )
      .subscribe(recipes => {
        this.recipeService.setRecipes(recipes);
      });
  }
}
