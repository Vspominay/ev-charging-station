import { NgIf, NgOptimizedImage } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { strongPasswordValidator } from '@core/constants/strong-password.validator';
import { trimRequiredValidator } from '@core/validators/trim-required.validator';
import { AuthFacade } from '@features/auth/data-access/auth.facade';
import { TSessionUser } from '@features/auth/data-access/models/user.type';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormElementDirective } from '@shared/components/form-control/directives/form-element.directive';
import {
  PasswordFieldDirective
} from '@shared/components/form-control/directives/password-field/password-field.directive';
import {
  StrengthCheckDirective
} from '@shared/components/form-control/directives/password-field/strength-check.directive';
import { FormControlComponent } from '@shared/components/form-control/form-control.component';
import { VcrContainerDirective } from '@shared/directives/vcr-container.directive';
import { getFormControlsNames } from '@shared/utils/get-form-controls-names.util';
import { ControlsOf } from '@shared/utils/types/controls-of.type';

@Component({
  selector: 'ev-confirm-password',
  standalone: true,
  templateUrl: './confirm-password.component.html',
  imports: [
    FormsModule,
    NgIf,
    NgbCarousel,
    NgbSlide,
    ReactiveFormsModule,
    RouterLink,
    NgOptimizedImage,
    FormControlComponent,
    FormElementDirective,
    PasswordFieldDirective,
    StrengthCheckDirective,
    TranslateModule,
    VcrContainerDirective
  ]
})
export default class ConfirmPasswordComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authFacade = inject(AuthFacade);

  @Input() set user(value: TSessionUser) {
    this.form.patchValue(value);
  }

  readonly form = this.fb.group<ControlsOf<TSessionUser & { password: string }>>({
    email: this.fb.control(''),
    password: this.fb.control('', [trimRequiredValidator, strongPasswordValidator(true)]),
    id: this.fb.control(''),
    fullName: this.fb.control(''),
    roles: this.fb.control([]),
  });
  readonly formControlNames = getFormControlsNames(this.form);
  readonly $formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue()
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.authFacade.confirmRegistration(this.form.getRawValue());
  }
}

