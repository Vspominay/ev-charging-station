import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TCharger } from '@features/chargers/data-access/models/charger.model';
import { ConnectorAvailability, TConnectorView } from '@features/chargers/data-access/models/connector.model';

import { catchError } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectorClient {
  private readonly http = inject(HttpClient);
  private readonly domain = 'Connector';
  private readonly baseUrl = environment.baseUrl;

  getConnectorsByChargers(chargePoints: Array<TCharger['id']>) {
    return this.http.post<Array<TConnectorView>>(`${this.baseUrl}${this.domain}/GetByChargePoints`, chargePoints)
               .pipe(catchError(() => []));
  }

  changeAvailability(connectorId: TConnectorView['id'], availability: ConnectorAvailability) {
    return this.http.post(`${this.baseUrl}${this.domain}/changeavailability`, {
      connectorId,
      availabilityType: availability
    });
  }
}
