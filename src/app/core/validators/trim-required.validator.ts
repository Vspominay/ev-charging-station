import { booleanAttribute } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export const trimRequiredValidator = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;

  if (!booleanAttribute(value)) return { required: true };

  if (typeof value === 'string') {
    return value.trim().length ? null : { required: true };
  }

  return null;
};
