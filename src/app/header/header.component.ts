import { Component } from '@angular/core';
import { Response } from '@angular/http';

import { DataService } from '../shared/data.service';
import { RecipeService } from '../recipes/recipe.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private dataService: DataService, private recipeService: RecipeService) {}

  onSaveData() {
    this.dataService.storeRecipes().subscribe((response: Response) => {
      console.log(response);
    });
  }

  onFetchData() {
    this.dataService.fetchRecipes();
  }
}
