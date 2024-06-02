import { numberAttribute, Pipe, PipeTransform } from '@angular/core';
import { roundDecimal } from '@shared/utils/round-decimal.util';

/**
 * Pipes to transform energy values into readable format.
 *
 * Receives Watt and return most appropriate unit.
 */
@Pipe({
  name: 'power',
  standalone: true
})
export class PowerPipe implements PipeTransform {
  transform(power?: number | string): string {
    const normalizedEnergy = roundDecimal(numberAttribute(power, 0), 0);

    if (normalizedEnergy < 1000) {
      return `${normalizedEnergy} W`;
    } else if (normalizedEnergy < 1000000) {
      return `${roundDecimal(normalizedEnergy / 1000, 2)} kW`;
    } else if (normalizedEnergy >= 1000000) {
      return `${roundDecimal(normalizedEnergy / 1000000, 2)} MW`;
    } else {
      return `${normalizedEnergy} W`;
    }
  }
}
