import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import * as fromApp from '../../store/app.reducer';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: true }) shoppingListForm: NgForm;
  subscription: Subscription;
  editedItem: Ingredient;
  editMode = false;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.subscription = this.store
      .select('shoppingList')
      .subscribe((state: fromShoppingList.ShoppingListState) => {
        if (state.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editedItem = state.editedIngredient;

          this.shoppingListForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount,
          });
        } else {
          this.editMode = false;
        }
      });
  }

  onSubmit(form: NgForm) {
    const { name, amount } = form.value;
    const ingredient = new Ingredient(name, amount);
    if (this.editMode) {
      this.store.dispatch(ShoppingListActions.updateIngredient({ ingredient }));
    } else {
      this.store.dispatch(ShoppingListActions.addIngredient({ ingredient }));
    }
    this.editMode = false;
    form.reset();
  }

  onDelete() {
    this.store.dispatch(ShoppingListActions.deleteIngredient());
    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.shoppingListForm.reset();
    this.store.dispatch(ShoppingListActions.stopEdit());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(ShoppingListActions.stopEdit());
  }
}
