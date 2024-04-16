import { InjectionToken } from '@angular/core';

type TErrorConfigFn = (args?: any) => { message: string, params?: Record<string, string> };

// TODO: clarify the list of apps' error messages
/**
 * The error messages for the form control validation
 * @type {{requiredTrue: () => string, appPasswordShouldMatch: () => string, minlength: ({requiredLength}: {requiredLength: any}) => string, banWords: ({bannedWord}: {bannedWord: any}) => string, passwordShouldMatch: () => string, pattern: () => string, appBanWords: ({bannedWord}: {bannedWord: any}) => string, required: () => string, email: () => string}}
 */
export const ERROR_MESSAGES: { [key: string]: TErrorConfigFn } = {
  required: () => buildErrorMessage(`base.errors.validators.required`),
  emailFormat: () => buildErrorMessage(`base.errors.validators.email-in-wrong-format`),
  minlength: ({ requiredLength }) => buildErrorMessage(`base.errors.validators.minlength`, { length: requiredLength }),
  maxlength: ({ requiredLength }) => buildErrorMessage(`base.errors.validators.maxlength`, { length: requiredLength }),
  pattern: () => buildErrorMessage(`base.errors.validators.pattern`),
  mask: ({ requiredMask }) => buildErrorMessage(`base.errors.validators.mask`, { mask: requiredMask }),
  passwordNotMatch: () => buildErrorMessage(`base.errors.validators.password-match`),
  sameFields: () => buildErrorMessage(`base.errors.validators.same-fields`),
  compareDates: () => buildErrorMessage(`base.errors.validators.compare-dates`),
};

export const buildErrorMessage = (message: string, params?: Record<string, string>) => ({ message, params });

export const VALIDATION_ERROR_MESSAGES = new InjectionToken(`Validation Messages`, {
  providedIn: 'root',
  factory: () => ERROR_MESSAGES
});

export const provideValidationMessages = (messages: { [key: string]: TErrorConfigFn }) => {
  return {
    provide: VALIDATION_ERROR_MESSAGES,
    useValue: {
      ...ERROR_MESSAGES,
      ...messages
    }
  };
};
