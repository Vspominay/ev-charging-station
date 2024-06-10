import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TCharger } from '@features/chargers/data-access/models/charger.model';
import {
  ConnectorAvailability, TAggregatedConnector, TConnectorView
} from '@features/chargers/data-access/models/connector.model';

import { catchError, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectorClient {
  private readonly http = inject(HttpClient);
  private readonly domain = 'Connector';
  private readonly baseUrl = environment.baseUrl;

  getConnectorsByChargers(chargePoints: Array<TCharger['id']>): Observable<Array<TConnectorView>> {
    return this.http.post<Array<TAggregatedConnector>>(`${this.baseUrl}aggregator/${this.domain}/GetByChargePoints`, chargePoints)
               .pipe(
                 catchError(() => []),
                 map((connectors) => connectors.sort((a, b) => a.connectorId - b.connectorId)),
                 map((connectors) => connectors.map(this.adaptAggregatedConnectorToConnectorView))
               );
  }

  changeAvailability(connectorId: TConnectorView['id'], availability: ConnectorAvailability) {
    return this.http.post(`${this.baseUrl}${this.domain}/changeavailability`, {
      connectorId,
      availabilityType: availability
    });
  }

  private adaptAggregatedConnectorToConnectorView({
    consumption,
    ...baseConnector
  }: TAggregatedConnector): TConnectorView {
    return {
      ...baseConnector,
      power: consumption.power,
      energy: consumption.consumedEnergy
    };
  }
}
