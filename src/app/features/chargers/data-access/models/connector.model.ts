import { TCharger } from '@features/chargers/data-access/models/charger.model';
import { WithGuid } from '@shared/utils/types/with-guid.type';

export enum ConnectorStatus {
  Online = 'online',
  Offline = 'offline',
  Faulted = 'faulted',
}

export type TConnector = WithGuid<{
  soc: number;
  status: ConnectorStatus;
  scheduledTime: Date;
  vehicleNum: string;
}>;

export type TConnectorWithCharger = TConnector & {
  charger: Pick<TCharger, 'id' | 'chargePointSerialNumber'>;
};
