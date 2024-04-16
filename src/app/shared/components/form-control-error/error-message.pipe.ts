import { inject, Pipe, PipeTransform } from '@angular/core';
import { VALIDATION_ERROR_MESSAGES } from './validation-error-messages.constant';

/**
 * Pipe to get an error message for the given error key.
 */
@Pipe({
  name: 'errorMessage',
  standalone: true
})
export class ErrorMessagePipe implements PipeTransform {

  private errorMessages = inject(VALIDATION_ERROR_MESSAGES);

  transform(key: string, errValue: any): { message: string, params?: Record<string, string> } {
    if (!this.errorMessages[key]) {
      console.warn(`Missing message for ${key} validator...`);
      return { message: '' };
    }
    return this.errorMessages[key](errValue);
  }

}
