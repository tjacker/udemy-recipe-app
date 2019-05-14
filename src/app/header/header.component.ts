import { Component } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';

import { DataService } from '../shared/data.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  onSaveData() {
    this.dataService.storeRecipes().subscribe((response: Response) => {
      console.log(response);
    });
  }

  onFetchData() {
    this.dataService.fetchRecipes();
  }

  onLogout() {
    this.router.navigate(['/signin']);
    this.authService.logout();
  }
}
