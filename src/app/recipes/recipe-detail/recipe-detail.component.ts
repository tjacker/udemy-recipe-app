import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
import { Recipe } from '../recipe.model';
import * as RecipeActions from '../store/recipe.actions';
import { RecipeState } from '../store/recipe.reducer';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((params: Params) => +params['id']),
        switchMap((id: number) => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map((recipeState: RecipeState) =>
          recipeState.recipes.find((_, index: number) => index === this.id)
        )
      )
      .subscribe((recipe: Recipe) => (this.recipe = recipe));
  }

  addToShoppingList() {
    this.store.dispatch(
      ShoppingListActions.addIngredients({ ingredients: this.recipe.ingredients })
    );
  }

  onEditRecipe() {
    // Below is an example of how to construct the route using the id by going up one level
    // this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.store.dispatch(RecipeActions.deleteRecipe({ index: this.id }));
    this.router.navigate(['/recipes']);
  }
}
