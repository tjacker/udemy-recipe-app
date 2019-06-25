import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
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
    this.http
      .put(this.url + token, this.recipeService.getRecipes())
      .subscribe((response: Response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    const token = this.authService.getToken();
    this.http
      .get(this.url + token)
      .pipe(
        map((response: Response) => {
          // FIXME: change to correct type
          const recipes: Recipe[] = response;

          for (let recipe of recipes) {
            if (!recipe['ingredients']) {
              console.log(recipe);
              recipe['ingredients'] = [];
            }
          }
          return recipes;
        })
      )
      .subscribe((recipes: Recipe[]) => {
        this.recipeService.setRecipes(recipes);
      });
  }
}
