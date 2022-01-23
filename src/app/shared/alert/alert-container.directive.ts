import { Directive, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[appAlertContainer]' })
export class AlertContainerDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
