import { Pipe, PipeTransform } from '@angular/core';

import { TLabelStyledConfig } from '@core/types/color-style.type';
import { ConnectorStatus } from '@features/chargers/data-access/models/connector.model';
import { TDepotChargerStats } from '../../data-access/models/depot.model';

type TDepotStats = TLabelStyledConfig & { value: string, icon: string };

@Pipe({
  name: 'depotStats',
  standalone: true
})
export class DepotStatsPipe implements PipeTransform {
  private readonly depotStatsConfig: Record<keyof TDepotChargerStats, (stats: TDepotChargerStats) => TDepotStats> = {
    [ConnectorStatus.Online]: (stats) => ({
      label: 'depot.statuses.online',
      style: 'success',
      value: stats.online.toString(),
      icon: 'charger'
    }),
    [ConnectorStatus.Offline]: (stats) => ({
      label: 'depot.statuses.offline',
      style: 'warning',
      value: stats.offline.toString(),
      icon: 'wifi_off'
    }),
    [ConnectorStatus.HasErrors]: (stats) => ({
      label: 'depot.statuses.faulted',
      style: 'danger',
      value: stats.hasErrors.toString(),
      icon: 'battery_error'
    }),
  };


  transform(value: TDepotChargerStats): Array<TDepotStats> {
    return Object.keys(value).map((key) => this.depotStatsConfig[key as keyof TDepotChargerStats](value));
  }

  private getPercentage(stats: TDepotChargerStats, key: keyof TDepotChargerStats): number {
    return (stats[key] / (stats.online + stats.offline + stats.hasErrors)) * 100;
  }
}
