import { createReducer, on } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions';

export interface RecipeState {
  recipes: Recipe[];
}

const initialState: RecipeState = {
  recipes: [],
};

export const recipeReducer = createReducer(
  initialState,
  on(RecipeActions.setRecipes, (state, { recipes }) => ({
    ...state,
    recipes: [...recipes],
  })),
  on(RecipeActions.addRecipe, (state, { recipe }) => ({
    ...state,
    recipes: [...state.recipes, recipe],
  })),
  on(RecipeActions.updateRecipe, (state, { index, recipe }) => {
    const updatedRecipe = {
      ...state.recipes[index],
      ...recipe,
    };
    const updatedRecipes = [...state.recipes];
    updatedRecipes[index] = updatedRecipe;

    return {
      ...state,
      recipes: updatedRecipes,
    };
  }),
  on(RecipeActions.deleteRecipe, (state, { index }) => ({
    ...state,
    recipes: state.recipes.filter((_, i) => i !== index),
  }))
);
