import { inject } from '@angular/core';
import { ConnectorClient } from '@features/chargers/data-access/connector.client';
import { TCharger } from '@features/chargers/data-access/models/charger.model';

export const chargerConnectors$ = (chargerId: TCharger['id']) => {
  const client = inject(ConnectorClient);

  return client.getConnectorsByChargers([chargerId]);
};
