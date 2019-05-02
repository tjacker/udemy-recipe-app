import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable()
export class DataService {
  constructor(private http: Http, private recipeService: RecipeService) {}

  storeRecipes() {
    // recipes.json is added to the URL to prevent CORS errors
    return this.http.put(
      'https://udemy-recipe-app-595f4.firebaseio.com/recipes.json',
      this.recipeService.getRecipes()
    );
  }

  fetchRecipes() {
    this.http
      .get('https://udemy-recipe-app-595f4.firebaseio.com/recipes.json')
      .pipe(
        map((response: Response) => {
          const recipes: Recipe[] = response.json();

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
