import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TDepotConfiguration } from '@features/depot/data-access/models/depot-configuration.model';
import { TDepot } from '@features/depot/data-access/models/depot.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnergyConsumptionsClient {
  private readonly domain = 'EnergyConsumptionSettings';
  private readonly apiUrl = `${environment.baseUrl}${this.domain}`;

  private readonly http = inject(HttpClient);

  getDepotConfiguration(depotId: TDepot['id']) {
    return this.http.get<TDepotConfiguration>(`${this.apiUrl}/getByDepot/${depotId}`);
  }

  setDepotConfiguration(depotConfiguration: TDepotConfiguration) {
    return this.http.post<TDepotConfiguration['id']>(`${this.apiUrl}/set`, depotConfiguration);
  }
}
