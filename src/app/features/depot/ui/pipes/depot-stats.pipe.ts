import { Pipe, PipeTransform } from '@angular/core';

import { TLabelStyledConfig } from '@core/types/color-style.type';
import { TDepotChargerStats } from '../../data-access/models/depot.model';

type TDepotStats = TLabelStyledConfig & { value: string, icon: string };

@Pipe({
  name: 'depotStats',
  standalone: true
})
export class DepotStatsPipe implements PipeTransform {
  private readonly depotStatsConfig: Record<keyof TDepotChargerStats, (stats: TDepotChargerStats) => TDepotStats> = {
    online: (stats) => ({
      label: 'depot.statuses.online',
      style: 'success',
      value: stats.online.toString(),
      icon: 'charger'
    }),
    offline: (stats) => ({
      label: 'depot.statuses.offline',
      style: 'warning',
      value: stats.offline.toString(),
      icon: 'wifi_off'
    }),
    faulted: (stats) => ({
      label: 'depot.statuses.faulted',
      style: 'danger',
      value: stats.faulted.toString(),
      icon: 'battery_error'
    }),
  };


  transform(value: TDepotChargerStats): Array<TDepotStats> {
    return Object.keys(value).map((key) => this.depotStatsConfig[key as keyof TDepotChargerStats](value));
  }

  private getPercentage(stats: TDepotChargerStats, key: keyof TDepotChargerStats): number {
    return (stats[key] / (stats.online + stats.offline + stats.faulted)) * 100;
  }
}
