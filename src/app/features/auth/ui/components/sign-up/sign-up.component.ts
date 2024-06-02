import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { APP_NAME } from '@core/constants/app-name.constant';
import { PHONE_MASK } from '@core/constants/phone-mask.constant';
import { strongPasswordValidator } from '@core/constants/strong-password.validator';
import { emailValidator } from '@core/validators/email.validator';
import { FIELD_MAX_LENGTH } from '@core/validators/field-max-length.validators';
import { trimRequiredValidator } from '@core/validators/trim-required.validator';
import { AuthFacade } from '@features/auth/data-access/auth.facade';
import { TRegisterRequest } from '@features/auth/data-access/models/register.model';
import { ERole } from '@features/auth/data-access/models/roles.enum';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import {
  PasswordFieldDirective
} from '@shared/components/form-control/directives/password-field/password-field.directive';
import {
  StrengthCheckDirective
} from '@shared/components/form-control/directives/password-field/strength-check.directive';
import { FormElementModule } from '@shared/components/form-control/form-control.module';
import { VcrContainerDirective } from '@shared/directives/vcr-container.directive';
import { getFormControlsNames } from '@shared/utils/get-form-controls-names.util';
import { ControlsOf } from '@shared/utils/types/controls-of.type';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'ev-sign-up',
  standalone: true,
  templateUrl: './sign-up.component.html',
  imports: [
    RouterLink,
    NgOptimizedImage,
    NgbCarousel,
    NgbSlide,
    ReactiveFormsModule,
    FormElementModule,
    PasswordFieldDirective,
    StrengthCheckDirective,
    VcrContainerDirective,
    NgxMaskDirective
  ]
})
export default class SignUpComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly facade = inject(AuthFacade);

  readonly appName = APP_NAME;

  readonly form = this.fb.group<ControlsOf<TRegisterRequest>>({
    email: this.fb.control('', [trimRequiredValidator, emailValidator()]),
    phone: this.fb.control('', [trimRequiredValidator]),
    password: this.fb.control('', [trimRequiredValidator, strongPasswordValidator(true)]),
    firstName: this.fb.control('', [trimRequiredValidator, FIELD_MAX_LENGTH]),
    lastName: this.fb.control('', [FIELD_MAX_LENGTH]),
    role: this.fb.control({ value: ERole.SuperAdministrator, disabled: true }, [FIELD_MAX_LENGTH]),
  });
  readonly formControlNames = getFormControlsNames(this.form);

  onSubmit() {
    if (this.form.invalid) return;

    this.facade.register(this.form.getRawValue());
  }

  protected readonly PHONE_MASK = PHONE_MASK;
}
