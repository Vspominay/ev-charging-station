import { Pipe, PipeTransform } from '@angular/core';

import { TLabelStyledConfig } from '@core/types/color-style.type';
import { EDepotStatus, TDepot } from '../../data-access/models/depot.model';

@Pipe({
  name: 'depotRibbon',
  standalone: true
})
export class DepotRibbonPipe implements PipeTransform {
  private readonly alertStatusConfig = new Map<EDepotStatus, TLabelStyledConfig>([
    [EDepotStatus.EnergyLimitReached, { label: 'depot.list.alerts.energy-limit-reached', style: 'danger' }],
  ]);

  transform({ status }: TDepot): TLabelStyledConfig | null {
    return this.alertStatusConfig.get(status) ?? null;
  }
}
