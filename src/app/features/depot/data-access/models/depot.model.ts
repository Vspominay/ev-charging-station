import { TAddress } from '@core/types/address.type';
import { TContactInfo } from '@core/types/contact-info.type';
import { TCoordinates } from '@core/types/coordinates.type';
import { TUpsertInfo } from '@core/types/upsert-info.type';
import { ConnectorStatus } from '@features/chargers/data-access/models/connector.model';
import { TDepotViewConfiguration } from '@features/depot/data-access/models/depot-configuration.model';
import { PartialByKeys } from '@shared/utils/types/partial-by-keys.util';
import { WithGuid } from '@shared/utils/types/with-guid.type';

export type TDepotPosition = TAddress & TCoordinates;

export enum EDepotStatus {
  Available,
  EnergyLimitReached,
}

/**
 * @see [BE response]{@link https://github.com/Nexus20/ChargingStation.Backend/blob/main/ChargingStation.Backend/API/ChargingStation.Depots/Models/Responses/DepotResponse.cs}
 */
export type TDepot = TContactInfo & TDepotPosition & TUpsertInfo & WithGuid<{
  name: string;
  status: EDepotStatus;
  energyLimit?: number;
  timezone?: string;

  // TODO: add more fields
  image?: string;
  description?: string;
}>;


export type TCreateDepot = PartialByKeys<Omit<TDepot, 'id' | 'createdAt' | 'updatedAt' | 'status'>, 'longitude' | 'latitude'>;

export type TDepotChargerStats = Record<ConnectorStatus, number>;

export type TDepotListItem = TDepot & { chargePointsStatistics: TDepotChargerStats };

export type TDepotDetailsResponse = TDepot & {
  energyConsumptionSettings: TDepotViewConfiguration | null
};
