import { AfterViewInit, DestroyRef, Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: 'input[passwordField]',
  host: {
    class: 'pe-7'
  },
  standalone: true
})
export class PasswordFieldDirective implements AfterViewInit {
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);
  private readonly input = inject(ElementRef).nativeElement as HTMLInputElement;
  private iconElement!: HTMLElement;

  private unlistenFns: Array<() => void> = [];

  @Input() eyeIcons: Record<'show' | 'hide', string> = {
    show: 'visibility',
    hide: 'visibility_off',
  };

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.unlistenFns.forEach((unlistenFn) => unlistenFn());
    });
  }

  ngAfterViewInit() {
    const { toggleButton, iconElement } = this.initTogglePasswordView();
    this.iconElement = iconElement;

    this.renderer.addClass(iconElement, 'material-symbols-outlined');
    this.renderer.addClass(iconElement, 'align-middle');

    this.changeType('password');

    this.unlistenFns.push(this.listenToggle(toggleButton), this.listenFocusOut());
  }

  private initTogglePasswordView() {
    const parentElement = this.input.parentNode as HTMLElement;

    this.updateParentElStyles(parentElement);

    const toggleButton = this.generateToggleButton();
    const iconElement = this.generateIconElement();

    this.renderer.appendChild(toggleButton, iconElement);
    this.renderer.appendChild(parentElement, toggleButton);

    return { toggleButton, iconElement };
  }

  private generateToggleButton() {
    const toggleButton = this.renderer.createElement('button');

    const buttonClasses = ['btn', 'btn-soft-link', 'btn-sm', 'position-absolute', 'end-0', 'top-0', 'bottom-0', 'text-decoration-none', 'text-muted', 'focus-ring', 'fs-16'];
    buttonClasses.forEach((className) => this.renderer.addClass(toggleButton, className));

    this.renderer.setProperty(toggleButton, 'style', '--asc-btn-hover-bg: transparent');
    this.renderer.setAttribute(toggleButton, 'no-styled', 'true');
    this.renderer.setAttribute(toggleButton, 'type', 'button');

    return toggleButton;
  }

  private generateIconElement() {
    return this.renderer.createElement('i');
  }

  private updateParentElStyles(parentElement: HTMLElement) {
    this.renderer.addClass(parentElement, 'auth-pass-inputgroup');
    this.renderer.addClass(parentElement, 'position-relative');
  }

  private listenFocusOut() {
    const parentElement = this.input.parentNode as HTMLElement;

    return this.renderer.listen(parentElement, 'focusout', (el) => {
      if (parentElement.contains(el.relatedTarget)) return;

      this.changeType('password');
    });
  }

  private listenToggle(toggleButton: HTMLButtonElement) {
    return this.renderer.listen(toggleButton, 'click', () => this.toggleType());
  }

  private toggleType() {
    const toggledType = this.input.type === 'password' ? 'text' : 'password';
    this.changeType(toggledType);
  }

  private changeType(type: 'text' | 'password') {
    this.renderer.setAttribute(this.input, 'type', type);

    this.updateIcon(type);
  }

  private updateIcon(type: 'text' | 'password') {
    const iconEl = this.iconElement;

    const [icon, prevIcon] = type === 'text' ? [this.eyeIcons.show, this.eyeIcons.hide] : [this.eyeIcons.hide, this.eyeIcons.show];

    const iconElText = iconEl.firstChild;
    if (iconElText) {
      this.renderer.removeChild(iconEl, iconEl.firstChild as Node);
    }

    this.renderer.appendChild(iconEl, this.renderer.createText(icon));
  }
}
