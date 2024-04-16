import { ChangeDetectorRef, Directive, ElementRef, inject, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';

import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';

@Directive({
  selector: 'input[withoutSpaces]',
  standalone: true,
})
export class InputFilterSpacesDirective {
  private readonly input = inject(ElementRef).nativeElement as HTMLInputElement;
  private readonly ngControl = inject(NgControl, { self: true, optional: true });
  private readonly renderer = inject(Renderer2);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    this.listenInputChanges();
  }

  private listenInputChanges() {
    fromEvent(this.input, 'input')
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(({ target }) => {
        const carretPosition = ((target as HTMLInputElement).selectionStart as number);

        const value = (target as HTMLInputElement).value;
        const newValue = value.replace(/\s/g, '');

        if (this.ngControl) {
          this.ngControl.control?.setValue(newValue);
          this.cdr.markForCheck();
        } else {
          this.renderer.setProperty(target, 'value', newValue);
        }

        (target as HTMLInputElement).setSelectionRange(carretPosition, carretPosition);
      });
  }
}
