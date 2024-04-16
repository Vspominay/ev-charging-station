import { Directive, ElementRef, inject, Renderer2 } from '@angular/core';

import { fromEvent, take } from 'rxjs';

@Directive({
  selector: 'input[withoutAutocomplete]',
  standalone: true,
})
export class WithoutAutocompleteDirective {
  private readonly input = inject(ElementRef).nativeElement as HTMLInputElement;
  private readonly renderer = inject(Renderer2);

  constructor() {
    this.renderer.setAttribute(this.input, 'readonly', 'true');

    fromEvent(this.input, 'focus', { capture: true })
      .pipe(take(1))
      .subscribe(() => {
        this.renderer.removeAttribute(this.input, 'readonly');
      });
  }
}
