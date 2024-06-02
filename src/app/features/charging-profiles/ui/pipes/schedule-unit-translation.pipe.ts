import { Pipe, PipeTransform } from '@angular/core';
import { ChargingRateUnitOptions } from '@features/charging-profiles/contsants/profie-upsert.constants';
import { ChargingRateUnit } from '@features/charging-profiles/data-access/models/charging-profile.model';

@Pipe({
  name: 'scheduleUnitTranslation',
  standalone: true
})
export class ScheduleUnitTranslationPipe implements PipeTransform {

  transform(unit: ChargingRateUnit): string {
    return ChargingRateUnitOptions.find(({ value, label }) => unit === value)?.label || unit.toString();
  }
}
