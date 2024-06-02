import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { APP_NAME } from '@core/constants/app-name.constant';
import { FIELD_MAX_LENGTH } from '@core/validators/field-max-length.validators';
import { trimRequiredValidator } from '@core/validators/trim-required.validator';
import { AuthFacade } from '@features/auth/data-access/auth.facade';
import { TLoginRequest } from '@features/auth/data-access/models/login.model';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import {
  PasswordFieldDirective
} from '@shared/components/form-control/directives/password-field/password-field.directive';
import { FormElementModule } from '@shared/components/form-control/form-control.module';
import { getFormControlsNames } from '@shared/utils/get-form-controls-names.util';
import { ControlsOf } from '@shared/utils/types/controls-of.type';

@Component({
  selector: 'ev-log-in',
  standalone: true,
  templateUrl: './log-in.component.html',
  imports: [
    RouterLink,
    NgOptimizedImage,
    NgbCarousel,
    NgbSlide,
    ReactiveFormsModule,
    FormElementModule,
    PasswordFieldDirective
  ]
})
export default class LogInComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly facade = inject(AuthFacade);

  readonly appName = APP_NAME;

  readonly form = this.fb.group<ControlsOf<TLoginRequest>>({
    email: this.fb.control('', [trimRequiredValidator, FIELD_MAX_LENGTH]),
    password: this.fb.control('', [trimRequiredValidator, FIELD_MAX_LENGTH])
  });
  readonly formControlNames = getFormControlsNames(this.form);

  login() {
    if (this.form.invalid) return;

    this.facade.login(this.form.getRawValue());
  }
}
