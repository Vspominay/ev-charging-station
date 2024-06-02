import { TUpsertInfo } from '@core/types/upsert-info.type';
import { TCharger } from '@features/chargers/data-access/models/charger.model';
import { TChargingProfile } from '@features/charging-profiles/data-access/models/charging-profile.model';
import { WithGuid } from '@shared/utils/types/with-guid.type';

export enum ConnectorStatus {
  Online = 'online',
  Offline = 'offline',
  HasErrors = 'hasErrors',
}

export enum ConnectorAvailability {
  Unavailable = 0,
  Available = 1
}

export enum ConnectorStatus16 {
  Available = 'Available',
  Occupied = 'Occupied',
  Reserved = 'Reserved',
  Unavailable = 'Unavailable',
  Faulted = 'Faulted',
  Charging = 'Charging', // Optional
  SuspendedEV = 'SuspendedEV', // Optional
}

type TConnectorStatus = TUpsertInfo & WithGuid<{
  connectorId: TConnectorEntity['id'],
  currentStatus: ConnectorStatus16,
  errorCode: string,
  info: string,
  vendorErrorCode: string,
  vendorId: string
  /**
   * ISO time
   */
  statusUpdatedTimestamp: string,
}>;

export type TConnector = WithGuid<{
  soc: number;
  status: ConnectorStatus;
  scheduledTime: Date;
  vehicleNum: string;
}>;

export type TConnectorEntity = TUpsertInfo & WithGuid<{
  chargePointId: TCharger['id'];
  connectorId: number;
  status: ConnectorStatus;
}>;

export type TConnectorWithCharger = TConnector & {
  charger: Pick<TCharger, 'id' | 'chargePointSerialNumber'>;
};

/**
 * BE Response
 */
export type TConnectorView = TConnectorSnapshotCharging & TUpsertInfo & WithGuid<{
  chargePointId: TCharger['id'];
  connectorId: number;
  currentStatus: TConnectorStatus | null;
  chargingProfilesIds: Array<TChargingProfile['id']> | null;
}>;

type TConnectorSnapshotCharging = {
  soc?: number;
  energy?: number
}

export type TConnectorChangeMessage = TConnectorSnapshotCharging & {
  connectorId: TConnectorView['id'];
  chargePointId: TCharger['id'];
  status?: ConnectorStatus16;
  transactionId?: number;
};
