import { Injectable } from '@angular/core';
import { BaseCrudService, TListResponse } from '@core/services/base-crud.service';
import { ConnectorStatus } from '@features/chargers/data-access/models/connector.model';
import {
  TCreateDepot, TDepot, TDepotDetailsResponse, TDepotListItem
} from '@features/depot/data-access/models/depot.model';
import { hashCode } from '@shared/utils/get-hash.util';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type TDepotResponse = Omit<TDepotListItem, 'image' | 'chargerStats'>;

@Injectable({
  providedIn: 'root'
})
export class DepotClientService extends BaseCrudService<TDepotResponse, TCreateDepot> {
  readonly domain = 'Depot';

  override getList(params: Record<keyof Partial<TDepot>, string>): Observable<TListResponse<TDepotResponse>> {
    return this.http.post<Array<TDepotResponse>>(`${this.aggregatorUrl}getall`, params)
               .pipe(
                 map((depots) => {
                   return {
                     collection: depots.map((depot) => this.adaptListItem(depot))
                   };
                 }));
  }

  override getById(depotId: TDepot['id']): Observable<TDepotListItem> {
    return this.http.get<TDepotDetailsResponse>(`${this.aggregatorUrl}${depotId}`)
               .pipe(map(depot => this.adaptListItem({
                 ...depot,
                 energyLimit: depot.energyConsumptionSettings?.depotEnergyLimit,
                 chargePointsStatistics: {
                   [ConnectorStatus.HasErrors]: 0,
                   [ConnectorStatus.Offline]: 0,
                   [ConnectorStatus.Online]: 0,
                 }
               })));
  }

  private adaptListItem(response: TDepotResponse): TDepotListItem {
    return {
      ...response,
      image: this.getImageByDepot(response.email ?? response.name),
    };
  }

  private getImageByDepot(email: TDepot['email']) {
    const index = hashCode(email) % this.images.length;
    return this.images[index];
  }

  private readonly images = Array.from({ length: 6 }, (_, i) => `https://themesbrand.com/velzon/html/interactive/assets/images/companies/img-${i + 1}.png`);

  private get aggregatorUrl() {
    return `${this.baseUrl}aggregator/${this.domain}/`;
  }
}
