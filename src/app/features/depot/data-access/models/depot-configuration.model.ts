import { TUpsertInfo } from '@core/types/upsert-info.type';
import { TCharger } from '@features/chargers/data-access/models/charger.model';
import { TDepot } from '@features/depot/data-access/models/depot.model';
import { WithGuid } from '@shared/utils/types/with-guid.type';
import dayjs from 'dayjs';

export type TDepotEnergyIntervalView = {
  startTime: dayjs.Dayjs;
  endTime: dayjs.Dayjs;
  energyLimit: number;
};

export type TChargerLimit = {
  chargePointId: TCharger['id'],
  chargePointEnergyLimit: number
};

export type TDepotViewConfiguration = TUpsertInfo & WithGuid<{
  depotId: TDepot['id'];
  depotEnergyLimit: TDepot['energyLimit'];

  validFrom: string;
  validTo: string;

  chargePointsLimits: Array<TChargerLimit>,
  intervals: Array<TDepotEnergyIntervalView>
}>;

export type TDepotConfiguration = Omit<TDepotViewConfiguration, 'intervals'> & {
  intervals: Array<{
    startTime: string;
    endTime: string;
    energyLimit: number;
  }>;
};
