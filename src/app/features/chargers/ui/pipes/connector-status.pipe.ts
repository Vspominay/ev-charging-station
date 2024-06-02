import { Pipe, PipeTransform } from '@angular/core';
import { TLabelStyleIconConfig } from '@core/types/color-style.type';
import { ConnectorStatus16 } from '@features/chargers/data-access/models/connector.model';

@Pipe({
  name: 'connectorStatus',
  standalone: true
})
export class ConnectorStatusPipe implements PipeTransform {
  private readonly statusStyleMap: Record<ConnectorStatus16, Omit<TLabelStyleIconConfig, 'label'>> = {
    [ConnectorStatus16.Available]: {
      style: 'success',
      icon: 'battery_status_good'
    },
    [ConnectorStatus16.Charging]: {
      style: 'info',
      icon: 'battery_charging_50'
    },
    [ConnectorStatus16.Faulted]: {
      style: 'danger',
      icon: 'battery_error'
    },
    [ConnectorStatus16.Occupied]: {
      style: 'warning',
      icon: 'electric_car'
    },
    [ConnectorStatus16.Reserved]: {
      style: 'secondary',
      icon: 'short_stay'
    },
    [ConnectorStatus16.Unavailable]: {
      style: 'dark',
      icon: 'power_off'
    },
    [ConnectorStatus16.SuspendedEV]: {
      style: 'warning',
      icon: 'cancel'
    }
  };

  transform(connectorStatus?: ConnectorStatus16): TLabelStyleIconConfig {
    if (!connectorStatus) return this.unknownConfig;

    const style = this.statusStyleMap[connectorStatus];

    if (!style) return this.unknownConfig;

    return {
      ...style,
      label: this.buildTranslation(connectorStatus),
    };
  }

  private buildTranslation(status: ConnectorStatus16 | 'unknown') {
    return `connector.statuses.${status.toLowerCase()}`;
  }

  private get unknownConfig(): TLabelStyleIconConfig {
    return { label: this.buildTranslation('unknown'), style: 'dark', icon: 'battery_unknown' };
  }
}
