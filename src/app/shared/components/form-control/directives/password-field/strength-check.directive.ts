import { AfterViewInit, ComponentRef, DestroyRef, Directive, ElementRef, inject, InjectionToken, Input, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';

import { DEFAULT_STRENGTH_OPTIONS, } from '@core/constants/validators/strong-password.validator';
import { StrengthCheckInfoComponent } from '@shared/components/form-control/directives/password-field/strength-check-info.component';

export type TStrengthOption = {
  label: string,
  isValid: (value: string) => boolean
};

export const STRENGTH_OPTIONS = new InjectionToken<Array<TStrengthOption>>('STRENGTH_OPTIONS', {
  providedIn: 'root',
  factory: () => DEFAULT_STRENGTH_OPTIONS
});

@Directive({
  selector: '[passwordField]:not([noStrengthCheck])',
  standalone: true,
})
export class StrengthCheckDirective implements AfterViewInit {
  private readonly input = inject(ElementRef).nativeElement as HTMLInputElement;
  private readonly destroyRef = inject(DestroyRef);
  private infoComponent!: ComponentRef<unknown>;

  @Input() strengthOptions: TStrengthOption[] = inject(STRENGTH_OPTIONS);
  @Input() container = inject(ViewContainerRef);

  ngAfterViewInit() {
    this.listenInputChanges();
  }

  private listenInputChanges() {
    fromEvent(this.input, 'input')
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ target }) => {
        this.infoComponent?.destroy();

        let isShowValidationInfo = false;
        const value = (target as HTMLInputElement).value;

        const options = this.strengthOptions.map(({ isValid: isValidFn, label }) => {
          const isValid = isValidFn(value);

          if (!isValid) {
            isShowValidationInfo = true;
          }

          return {
            label,
            isValid
          };
        });

        for (const option of this.strengthOptions) {
          if (!option.isValid(value)) {
            isShowValidationInfo = true;
          }
        }

        const isValid = this.input.classList.contains('ng-valid');

        if (!isValid && isShowValidationInfo) {
          this.infoComponent = this.container.createComponent(StrengthCheckInfoComponent);
          this.infoComponent.setInput('options', options);
        }
      });
  }
}
