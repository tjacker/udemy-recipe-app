import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      'Spare Ribs',
      'Dry rub spare ribs with salad',
      'https://c.pxhere.com/photos/8b/0f/food_meat_recipe_power_pork_dishes-604134.jpg!d',
      [
        new Ingredient('Pork ribs', 1),
        new Ingredient('Dry rub spices', 1),
        new Ingredient('Tomatoes', 2)
      ]
    ),
    new Recipe(
      'Beef Stew',
      'Slow cooker beef stew',
      'https://www.simplyrecipes.com/wp-content/uploads/2013/03/slow-cooker-guinness-stew-horiz-a-1200.jpg',
      [new Ingredient('Stew beef', 1), new Ingredient('Potatoes', 3), new Ingredient('Carrots', 2)]
    )
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes() {
    // Returns a copy of the original array to avoid mutation
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
