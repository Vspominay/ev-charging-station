import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[icon]',
  host: {
    class: 'material-symbols-outlined'
  },
  standalone: true
})
export class IconDirective {
  readonly #renderer = inject(Renderer2);
  readonly #host = inject(ElementRef).nativeElement;

  @Input() set icon(value: string | undefined) {
    if (!value) return;

    this.removeContent();
    this.#renderer.appendChild(this.#host, this.#renderer.createText(value));
  }

  private removeContent() {
    const child = this.#host.firstChild;

    child && this.#renderer.removeChild(this.#host, child);
  }
}
