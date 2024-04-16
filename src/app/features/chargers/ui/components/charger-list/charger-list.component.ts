import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TCharger } from '@features/chargers/data-access/models/charger.model';
import { ConnectorStatus, TConnector } from '@features/chargers/data-access/models/connector.model';
import { ConnectorCardComponent } from '@features/chargers/ui/components/connector-card/connector-card.component';

@Component({
  selector: 'ev-charger-list',
  standalone: true,
  imports: [
    ConnectorCardComponent,
    KeyValuePipe
  ],
  templateUrl: './charger-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ChargerListComponent {
  readonly connectors: Array<TConnector> = [
    {
      vehicleNum: 'BUS1',
      soc: 50,
      id: 'asf23-mnasf-123',
      scheduledTime: new Date(),
      status: ConnectorStatus.Online
    }
  ];

  readonly chargers: Record<TCharger['chargePointSerialNumber'], Array<TConnector>> = {
    '123ASD': [
      {
        vehicleNum: 'BUS1',
        soc: 50,
        id: 'asf23-mnasf-123',
        scheduledTime: new Date(),
        status: ConnectorStatus.Online
      },
    ],
    '123ASD1': [
      {
        vehicleNum: 'BUS1',
        soc: 50,
        id: 'asf23-mnasf-123',
        scheduledTime: new Date(),
        status: ConnectorStatus.Online
      },
      {
        vehicleNum: 'BUS1',
        soc: 50,
        id: 'asf23-mnasf-123',
        scheduledTime: new Date(),
        status: ConnectorStatus.Online
      }
    ],
    '123ASD2': [
      {
        vehicleNum: 'BUS1',
        soc: 50,
        id: 'asf23-mnasf-123',
        scheduledTime: new Date(),
        status: ConnectorStatus.Online
      },
      {
        vehicleNum: 'BUS1',
        soc: 50,
        id: 'asf23-mnasf-123',
        scheduledTime: new Date(),
        status: ConnectorStatus.Online
      },
      {
        vehicleNum: 'BUS1',
        soc: 50,
        id: 'asf23-mnasf-123',
        scheduledTime: new Date(),
        status: ConnectorStatus.Online
      }
    ]
  };
}
