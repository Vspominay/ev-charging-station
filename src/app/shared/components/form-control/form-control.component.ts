import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, ContentChild, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { trimRequiredValidator } from '@core/validators/trim-required.validator';

import { FormElementIconsDirective } from './directives/form-element-icons.directive';
import { FormElementAbstraction } from './models/form-control.model';

@Component({
  selector: 'app-form-control',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    FormElementIconsDirective,
    NgTemplateOutlet,
  ],
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormControlComponent {
  @ContentChild(FormElementAbstraction)
  formControl?: FormElementAbstraction;

  @Input() label = '';

  @Input() hint: string = '';
  @Input() hideHintOnFill: boolean = false;
  @Input({ transform: booleanAttribute }) withRelativeError = false;

  get isRequired(): boolean {
    const control = this.formControl?.ngControl?.control;

    if (!control) return false;

    const isFormControl = control instanceof FormControl;
    const requiredValidators = [Validators.required, trimRequiredValidator];
    return isFormControl && requiredValidators.some((validator) => control.hasValidator(validator));
  }

  get id(): string {
    return this.formControl?.id || '';
  }
}
