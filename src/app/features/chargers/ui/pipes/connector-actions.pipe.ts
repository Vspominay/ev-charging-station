import { Pipe, PipeTransform } from '@angular/core';
import { ConnectorStatus16, TConnector, TConnectorView } from '@features/chargers/data-access/models/connector.model';
import { ConnectorAction } from '@features/chargers/data-access/services/connectors-actions.service';
import { TViewActionItem } from '@shared/utils/types/actions.types';

@Pipe
({
  name: 'connectorActions',
  standalone: true
})
export class ConnectorActionsPipe implements PipeTransform {
  private inoperativeStatuses = new Set([ConnectorStatus16.Unavailable, ConnectorStatus16.Faulted]);

  transform(actions: Array<TViewActionItem<ConnectorAction, TConnector>>, connector: TConnectorView,): Array<TViewActionItem<ConnectorAction, TConnector>> {
    const isAvailableConnector = !this.inoperativeStatuses.has(connector.currentStatus?.currentStatus ?? ConnectorStatus16.Unavailable);

    return isAvailableConnector ?
      actions.filter(action => action.value !== ConnectorAction.MarkAvailable) :
      actions.filter(action => action.value !== ConnectorAction.MarkUnavailable);
  }
}
