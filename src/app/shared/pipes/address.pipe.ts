import { Pipe, PipeTransform } from '@angular/core';

import { TAddress } from '@core/types/address.type';

@Pipe({
  name: 'address',
  standalone: true
})
export class AddressPipe implements PipeTransform {
  transform({ street, country, city, building }: TAddress): string {
    return [country, city, street, building].filter(Boolean).join(', ');
  };
}
