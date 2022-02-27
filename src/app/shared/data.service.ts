import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({ providedIn: 'root' })
export class DataService {
  // recipes.json is added to the URL to prevent CORS errors
  url = 'https://udemy-recipe-app-25862.firebaseio.com/recipes.json';

  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    let confirmation: boolean;

    if (recipes.length === 0) {
      confirmation = confirm(
        'This will remove all your saved recipes. Are you sure you want to continue?'
      );

      if (!confirmation) {
        return false;
      }
    }

    this.http.put(this.url, recipes).subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.url).pipe(
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
