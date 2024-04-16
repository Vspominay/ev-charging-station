import { Directive, inject, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[vcrContainer]',
  standalone: true,
  exportAs: 'vcrContainer',
})
export class VcrContainerDirective {
  container = inject(ViewContainerRef);
}
