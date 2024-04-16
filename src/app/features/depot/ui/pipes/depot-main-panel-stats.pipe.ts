import { numberAttribute, Pipe, PipeTransform } from '@angular/core';
import { EMPTY_PLACEHOLDER } from '@core/constants/empty-placeholder.constant';
import { TLabelStyledConfig } from '@core/types/color-style.type';
import { TDepot } from '@features/depot/data-access/models/depot.model';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

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
  transform(depot: TDepot, currentTime: number): Array<TDepotMainPanelStats> {
    return [
      this.getMaxProvisionPower(depot),
      this.getLocalTime(depot, currentTime),
      this.getLocation(depot)
    ];
  }

  private getMaxProvisionPower(depot: TDepot): TDepotMainPanelStats {
    return {
      icon: 'data_usage',
      style: 'primary',
      value: numberAttribute(depot.energyLimit) ? `${depot.energyLimit} kWh` : EMPTY_PLACEHOLDER,
      subtitle: '10:00 - 19:23',
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

  private getLocation({ street, country, city, building }: TDepot): TDepotMainPanelStats {
    return {
      icon: 'location_on',
      style: 'info',
      value: [city, street, building].filter(Boolean).join(', '),
      subtitle: country,
      label: 'depot.configuration.location.title'
    };
  }
}
