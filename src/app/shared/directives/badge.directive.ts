import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core';
import { TColorStyle } from '@core/types/color-style.type';

@Directive({
  selector: '[badge]',
  host: {
    class: 'badge'
  },
  standalone: true
})
export class BadgeDirective {
  readonly #renderer = inject(Renderer2);
  readonly #elRef = inject(ElementRef).nativeElement;
  #previousColor: TColorStyle | null = null;

  @Input({ required: true }) set badge(value: TColorStyle) {
    this.updatePreviousColor(value);
    this.addBadgeClasses(value);
  }

  private updatePreviousColor(value: TColorStyle) {
    if (this.#previousColor) {
      const previousClasses = this.getBadgeClasses(this.#previousColor);
      previousClasses.forEach((className) => this.#renderer.removeClass(this.#elRef, className));
    }

    this.#previousColor = value;
  }

  private addBadgeClasses(value: TColorStyle) {
    const badgeClasses = this.getBadgeClasses(value);
    badgeClasses.forEach((className) => this.#renderer.addClass(this.#elRef, className));
  }

  private getBadgeClasses(value: TColorStyle): Array<string> {
    return [
      `bg-${value}-subtle`,
      `text-${value}`
    ];
  }
}
