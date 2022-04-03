import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromRecipes from '../recipes/store/recipe.reducer';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

export interface AppState {
  auth: fromAuth.AuthState;
  recipes: fromRecipes.RecipeState;
  shoppingList: fromShoppingList.ShoppingListState;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  recipes: fromRecipes.recipeReducer,
  shoppingList: fromShoppingList.shoppingListReducer,
};
