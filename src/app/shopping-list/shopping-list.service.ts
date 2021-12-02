import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  ingredientsChange = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [new Ingredient('Onions', 5), new Ingredient('Peppers', 10)];

  getIngredients() {
    // Returns a copy of the original array to avoid mutation
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.updateIngredients();
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.updateIngredients();
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.updateIngredients();
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.updateIngredients();
  }

  updateIngredients() {
    this.ingredientsChange.next(this.ingredients.slice());
  }
}
