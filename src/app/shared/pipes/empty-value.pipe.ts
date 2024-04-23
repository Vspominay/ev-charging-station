import { Pipe, PipeTransform } from '@angular/core';
import { EMPTY_PLACEHOLDER } from '@core/constants/empty-placeholder.constant';

@Pipe({
  name: 'emptyValue',
  standalone: true
})
export class EmptyValuePipe implements PipeTransform {
  public transform(value: any) {
    return Boolean(value) || EMPTY_PLACEHOLDER;
  }
}
