import { AbstractControl } from '@angular/forms';
import { TStrengthOption } from '@shared/components/form-control/directives/password-field/strength-check.directive';

export const passwordLengthValidator = (value: string) => value.length >= 8;
export const passwordLowercaseValidator = (value: string) => /[a-z]/.test(value);
export const passwordUppercaseValidator = (value: string) => /[A-Z]/.test(value);
export const passwordNumberValidator = (value: string) => /[0-9]/.test(value);

/**
 * The list of the strength options for the password.
 */
export const DEFAULT_STRENGTH_OPTIONS: TStrengthOption[] = [
  {
    label: 'base.password.validation.length',
    isValid: passwordLengthValidator,
  },
  {
    label: 'base.password.validation.lowercase',
    isValid: passwordLowercaseValidator,
  },
  {
    label: 'base.password.validation.uppercase',
    isValid: passwordUppercaseValidator,
  },
  {
    label: 'base.password.validation.number',
    isValid: passwordNumberValidator,
  },
];

export const strongPasswordValidator = (validateOnEmpty = true, strengthOptions = DEFAULT_STRENGTH_OPTIONS.map(({ isValid }) => isValid)) => {
  return (control: AbstractControl) => {
    const value = control.value as string;

    if (value.length === 0 && !validateOnEmpty) return null;

    const isValid = strengthOptions.every((isValidFn) => isValidFn(value));

    return isValid ? null : { strongPassword: true };
  };
};
