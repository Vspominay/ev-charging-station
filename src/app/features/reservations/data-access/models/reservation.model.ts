import { TCharger } from '@features/chargers/data-access/models/charger.model';
import { TConnector } from '@features/chargers/data-access/models/connector.model';
import { TOcppTag } from '@features/ocpp-tags/data-access/models/ocpp-tag.model';
import { WithGuid } from '@shared/utils/types/with-guid.type';

export type TReservation = WithGuid<{
  reservationId: string,
  chargePointId: TCharger['id'],
  connectorId: TConnector['id'],
  transactionId: string,
  tagId: TOcppTag['id'],

  name: string,
  description: string,
  status: string,
  isCancelled: boolean,

  startDateTime: string,
  expiryDateTime: string,
}>;

export type TUpsertReservation =
  Pick<TReservation, 'chargePointId' | 'connectorId' | 'startDateTime' | 'expiryDateTime' | 'name' | 'description'>
  & {
  ocppTagId: TOcppTag['id'],
};
