import { AfterContentInit, Directive, ElementRef, inject, Renderer2 } from '@angular/core';

/**
 * Directive controls styles of icon in a form element
 */
@Directive({
  selector: '[formElementIcons]',
  standalone: true
})
export class FormElementIconsDirective implements AfterContentInit {
  private host = inject(ElementRef).nativeElement;
  private renderer = inject(Renderer2);

  public ngAfterContentInit() {
    const field = this.host.children[0];

    if (!field) return;

    const isPrefixIconExist = this.isIconExist('prefix');
    const isSuffixIconExist = this.isIconExist('suffix');


    if (!isPrefixIconExist && !isSuffixIconExist) {
      return;
    }

    this.setFieldIconClass(field);

    if (isPrefixIconExist) {
      this.addPrefixIconClass();
    }

    if (isSuffixIconExist) {
      this.addSuffixIconClass();
    }
  }

  private setFieldIconClass(field: HTMLElement) {
    this.renderer.addClass(field, 'form-control-icon');
  }

  private addPrefixIconClass() {
    this.renderer.addClass(this.host, 'form-icon');
  }

  private addSuffixIconClass() {
    this.renderer.addClass(this.host, 'right');
  }

  private isIconExist(position: 'suffix' | 'prefix') {
    return Boolean(this.host.querySelector(`[${position}-icon]`));
  }
}
