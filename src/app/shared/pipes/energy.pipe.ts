import { numberAttribute, Pipe, PipeTransform } from '@angular/core';
import { roundDecimal } from '@shared/utils/round-decimal.util';

@Pipe({
  name: 'energy',
  standalone: true
})
export class EnergyPipe implements PipeTransform {
  transform(energy?: number | string): string {
    const normalizedEnergy = roundDecimal(numberAttribute(energy, 0), 0);

    if (normalizedEnergy < 1000) {
      return `${normalizedEnergy} Wh`;
    } else if (normalizedEnergy < 1000000) {
      return `${roundDecimal(normalizedEnergy / 1000, 2)} kWh`;
    } else if (normalizedEnergy >= 1000000) {
      return `${roundDecimal(normalizedEnergy / 1000000, 2)} MWh`;
    } else {
      return `${normalizedEnergy} Wh`;
    }
  }
}
