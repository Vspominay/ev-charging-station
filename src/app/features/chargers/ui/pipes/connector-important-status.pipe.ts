import { Pipe, PipeTransform } from '@angular/core';
import { ConnectorStatus16, TConnectorView } from '@features/chargers/data-access/models/connector.model';

@Pipe({
  name: 'connectorImportantStatus',
  standalone: true
})
export class ConnectorImportantStatusPipe implements PipeTransform {
  private readonly connectorStatusImportance = [
    ConnectorStatus16.Faulted,      // Most critical
    ConnectorStatus16.Charging,     // Crucial for monitoring ongoing sessions
    ConnectorStatus16.Reserved,     // Set aside for specific user or purpose
    ConnectorStatus16.Occupied,     // Important for managing availability
    ConnectorStatus16.SuspendedEV,  // Optional, specific troubleshooting
    ConnectorStatus16.Available,     // Ready for use
    ConnectorStatus16.Unavailable  // Needs intervention
  ];

  transform(connectors: Array<TConnectorView>): ConnectorStatus16 {
    for (const status of this.connectorStatusImportance) {
      if (connectors.some(connector => connector.currentStatus?.currentStatus === status)) {
        return status;
      }
    }

    return ConnectorStatus16.Unavailable;
  }
}
