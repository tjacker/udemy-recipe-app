import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertContainerDirective } from './alert/alert-container.directive';
import { AlertComponent } from './alert/alert.component';
import { DropdownDirective } from './dropdown.directive';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';

@NgModule({
  declarations: [
    AlertContainerDirective,
    AlertComponent,
    LoadingIndicatorComponent,
    DropdownDirective
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    AlertContainerDirective,
    AlertComponent,
    LoadingIndicatorComponent,
    DropdownDirective
  ]
})
export class SharedModule {}
