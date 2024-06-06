import { TCharger } from '@features/chargers/data-access/models/charger.model';
import { TDepot } from '@features/depot/data-access/models/depot.model';

export interface IEnergyUsageRequest {
  depotId: TDepot['id'];
  startDate: string;
  endDate: string;
  interval: number;
}

export interface IEnergyUsageResponse {
  startDate: string;
  endDate: string;

  data: Array<IEnergyUsageItem>;
}

export interface IEnergyUsageItem {
  chargePointId: TCharger['id'];
  chargePointName: TCharger['name'];
  energyUsage: number;
}
