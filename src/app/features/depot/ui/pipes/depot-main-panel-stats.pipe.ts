import { numberAttribute, Pipe, PipeTransform } from '@angular/core';
import { EMPTY_PLACEHOLDER } from '@core/constants/empty-placeholder.constant';
import { TLabelStyledConfig } from '@core/types/color-style.type';
import { TDepotEnergyIntervalView } from '@features/depot/data-access/models/depot-configuration.model';
import { TDepot } from '@features/depot/data-access/models/depot.model';
import { AddressPipe } from '@shared/pipes/address.pipe';
import { EnergyPipe } from '@shared/pipes/energy.pipe';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

type TDepotMainPanelStats = TLabelStyledConfig & {
  icon: string;
  subtitle?: string;
  value: string;
};

@Pipe({
  name: 'depotMainPanelStats',
  standalone: true
})
export class DepotMainPanelStatsPipe implements PipeTransform {
  private energyPipe = new EnergyPipe();
  private addressPipe = new AddressPipe();

  transform(depot: TDepot, currentInterval: TDepotEnergyIntervalView, currentTime: number, lang: string): Array<TDepotMainPanelStats> {
    console.log(currentInterval);
    return [
      this.getMaxProvisionPower(currentInterval),
      this.getLocalTime(depot, currentTime),
      this.getLocation(depot)
    ];
  }

  private getMaxProvisionPower(currentInterval: TDepotEnergyIntervalView): TDepotMainPanelStats {
    return {
      icon: 'data_usage',
      style: 'primary',
      value: numberAttribute(currentInterval.energyLimit) ? `${this.energyPipe.transform(currentInterval.energyLimit)}` : EMPTY_PLACEHOLDER,
      subtitle: `${this.getHourlyTime(currentInterval.startTime)} - ${this.getHourlyTime(currentInterval.endTime)}`,
      label: 'depot.configuration.max-provision'
    };
  }

  private getLocalTime(depot: TDepot, currentTime: number): TDepotMainPanelStats {
    return {
      icon: 'schedule',
      style: 'secondary',
      value: dayjs(currentTime).tz(depot.timezone).format('LLL'),
      subtitle: depot.timezone,
      label: 'depot.configuration.timezone.local-time'
    };
  }

  private getLocation(depot: TDepot): TDepotMainPanelStats {
    return {
      icon: 'location_on',
      style: 'info',
      value: this.addressPipe.transform(depot).replace(depot.country + ',', ''),
      subtitle: depot.country,
      label: 'depot.configuration.location.title'
    };
  }

  private getHourlyTime(time: Dayjs | string): string {
    return dayjs(time).format('DD.MM HH:mm');
  }
}
