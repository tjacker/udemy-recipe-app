import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-indicator',
  template: '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>',
  styleUrls: ['./loading-indicator.component.css']
})
export class LoadingIndicatorComponent {}
