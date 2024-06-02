import { ValidatorFn } from '@angular/forms';

/**
 * @see {@link https://regex101.com/library/PEtM4r?filterFlavors=dotnet&filterFlavors=javascript&orderBy=LEAST_POINTS&page=6&search=email}
 */
export const EMAIL_REGEXP = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
export const emailValidator = (): ValidatorFn => {
  return (control) => {
    if (!control.value) {
      return null;
    }

    const emailMaxLength = 320;
    const isExtraLongEmail = control.value.length > emailMaxLength;
    const isWrongFormat = !EMAIL_REGEXP.test(control.value);

    if (isWrongFormat) return { emailFormat: true };
    if (isExtraLongEmail) return { maxlength: { requiredLength: emailMaxLength } };

    return null;
  };
};
