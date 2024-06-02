import { TUpsertInfo } from '@core/types/upsert-info.type';
import { TConnectorView } from '@features/chargers/data-access/models/connector.model';
import { TDepot } from '@features/depot/data-access/models/depot.model';
import { WithGuid } from '@shared/utils/types/with-guid.type';

export type TCharger = TUpsertInfo & WithGuid<{
  name?: string;

  depotId: TDepot['id'];
  ocppProtocol?: string;
  description: string;

  registrationStatus: string,
  chargePointVendor: string,
  chargePointModel: string,
  chargePointSerialNumber: string,
  chargeBoxSerialNumber: string,
  firmwareVersion: string,
  iccid: string,
  imsi: string,
  meterType: string,
  meterSerialNumber: string,

  firmwareUpdateTimestamp: string; // ISO date
  diagnosticsTimestamp: string; // ISO date
  lastHeartbeat: string; // ISO date
}>;

export type TChargerUpsert = Partial<Pick<TCharger, 'name' | 'description' | 'id'>>;

export type TChargerWithConnectors = TCharger & {
  connectors: Array<TConnectorView>;
};

export enum ChargerRestart {
  Hard,
  Soft
}
