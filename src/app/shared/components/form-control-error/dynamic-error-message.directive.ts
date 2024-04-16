import { ComponentRef, DestroyRef, Directive, inject, Input, OnInit, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { startWith } from 'rxjs';
import { ControlErrorComponent } from './control-error.component';

/**
 * Directives dynamically add error messages to the form control.
 */
@Directive({
  selector: `
    [formControl]:not([withoutValidation]),
    [formControlName]:not([withoutValidation]),
  `,
  standalone: true,
})
export class DynamicErrorMessageDirective implements OnInit {
  ngControl = inject(NgControl, { self: true });
  private destroyRef = inject(DestroyRef);

  @Input()
  container = inject(ViewContainerRef);

  private componentRef: ComponentRef<ControlErrorComponent> | null = null;

  ngOnInit() {
    this.ngControl.control?.statusChanges.pipe(
      startWith(this.ngControl.control?.status),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      const control = this.ngControl.control;

      if (control && control.invalid && control.dirty) {
        if (!this.componentRef) {
          this.componentRef = this.container.createComponent(ControlErrorComponent);
          this.componentRef.changeDetectorRef.markForCheck();
        }
        this.componentRef.setInput('errors', this.ngControl.errors);
      } else {
        this.componentRef?.destroy();
        this.componentRef = null;
      }
    });
  }
}
