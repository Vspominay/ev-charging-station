import { Attribute, Directive, ElementRef, inject, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormElementAbstraction } from '../models/form-control.model';

//TODO: update list of valid selectors
/**
 * Directives provides access to [common form element's properties]{@link FormElementAbstraction}
 */
@Directive({
  selector: `
    input:not([custom-control]):not([type=checkbox]),
    textarea:not([custom-control]),
    ng-select, 
    ngx-slider
  `,
  standalone: true,
  providers: [{
    provide: FormElementAbstraction,
    useExisting: FormElementDirective
  }]
})
export class FormElementDirective implements FormElementAbstraction {
  private renderer = inject(Renderer2);
  private nativeElement = inject(ElementRef).nativeElement;

  readonly ngControl = inject(NgControl, {
    self: true,
    optional: true
  });

  protected set controlClass(value: string) {
    if (!value) return;

    this.renderer.addClass(this.nativeElement, value);
  }

  constructor(
    @Attribute('id') public id: string,
    @Attribute('control-class') controlClass?: string | '',
  ) {

    this.controlClass = controlClass ?? 'form-control';
    this.checkNgControl();
  }

  private checkNgControl(): void {
    if (!this.ngControl) {
      console.warn(`FormElementDirective: NgControl is not provided for ${this.nativeElement.tagName} element`);
    }
  }
}
