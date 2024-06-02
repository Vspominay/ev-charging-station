import { inject, Injectable } from '@angular/core';
import { AActionService } from '@core/abstractions/base-acitons.abstraction';
import { ConnectorClient } from '@features/chargers/data-access/connector.client';
import {
  ConnectorAvailability, TConnector, TConnectorView
} from '@features/chargers/data-access/models/connector.model';
import { TActionsMap } from '@shared/utils/types/actions.types';
import Swal from 'sweetalert2';

export enum ConnectorAction {
  MarkAvailable = 'markAvailable',
  MarkUnavailable = 'markUnavailable'
}

@Injectable({
  providedIn: 'root'
})
export class ConnectorsActionsService extends AActionService<ConnectorAction, TConnectorView, undefined> {
  private readonly client = inject(ConnectorClient);

  readonly actionsMap: TActionsMap<ConnectorAction, TConnectorView> = {
    [ConnectorAction.MarkAvailable]: {
      label: 'Mark available',
      handler: ({ id }) => this.changeAvailability(id, ConnectorAvailability.Available),
      data: undefined
    },
    [ConnectorAction.MarkUnavailable]: {
      label: 'Mark unavailable',
      handler: ({ id }) => this.changeAvailability(id, ConnectorAvailability.Unavailable),
      data: undefined
    }
  };

  changeAvailability(connectorId: TConnector['id'], availability: ConnectorAvailability) {
    this.client.changeAvailability(connectorId, availability)
        .subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: `The command to change the availability of the connector has been sent.`,
            timer: 2000,
            timerProgressBar: true
          });
        });
  }
}
