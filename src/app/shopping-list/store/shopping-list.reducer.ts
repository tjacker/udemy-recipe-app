import { createReducer, on } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface ShoppingListState {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: ShoppingListState = {
  ingredients: [new Ingredient('Onions', 5), new Ingredient('Peppers', 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};
export const shoppingListReducer = createReducer(
  initialState,
  on(ShoppingListActions.addIngredient, (state, { ingredient }) => ({
    ...state,
    ingredients: [...state.ingredients, ingredient],
  })),
  on(ShoppingListActions.addIngredients, (state, { ingredients }) => ({
    ...state,
    ingredients: [...state.ingredients, ...ingredients],
  })),
  on(ShoppingListActions.updateIngredient, (state, { ingredient }) => {
    const updatedIngredient = {
      ...state.editedIngredient,
      ...ingredient,
    };
    const updatedIngredients = [...state.ingredients];
    updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

    return {
      ...state,
      ingredients: updatedIngredients,
      editedIngredient: null,
      editedIngredientIndex: -1,
    };
  }),
  on(ShoppingListActions.deleteIngredient, state => ({
    ...state,
    ingredients: state.ingredients.filter((_, index) => index !== state.editedIngredientIndex),
    editedIngredient: null,
    editedIngredientIndex: -1,
  })),
  on(ShoppingListActions.startEdit, (state, { index }) => ({
    ...state,
    editedIngredientIndex: index,
    editedIngredient: { ...state.ingredients[index] },
  })),
  on(ShoppingListActions.stopEdit, state => ({
    ...state,
    editedIngredient: null,
    editedIngredientIndex: -1,
  }))
);
