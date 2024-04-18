import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base-crud.service';
import { TCreateDepot, TDepot, TDepotListItem } from '@features/depot/data-access/models/depot.model';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export type TDepotResponse = Omit<TDepotListItem, 'image' | 'chargerStats'>;

@Injectable({
  providedIn: 'root'
})
export class DepotClientService extends BaseCrudService<TDepotResponse, TCreateDepot> {
  readonly domain = 'Depot';

  loadList(searchQuery: string): Observable<Array<TDepotListItem>> {
    return this.getList()
               .pipe(map(({ collection }) => collection.map(depot => this.adaptListItem(depot))));
  }

  loadById(depotId: TDepot['id']): Observable<TDepotListItem> {
    return this.getById(depotId)
               .pipe(map(depot => this.adaptListItem(depot)));
  }

  private adaptListItem(response: TDepotResponse): TDepotListItem {
    return {
      ...response,
      image: this.getRandomImage(),
      chargerStats: this.getStats()
    };
  }

  private getRandomImage() {
    const imageUrl = 'https://themesbrand.com/velzon/html/interactive/assets/images/companies/';
    const images = ['img-1.png', 'img-3.png', 'img-4.png', 'img-5.png', 'img-6.png'];

    return imageUrl + images[Math.floor(Math.random() * images.length)];
  }

  private getStats() {
    return {
      online: Math.floor(Math.random() * 10),
      offline: Math.floor(Math.random() * 10),
      faulted: Math.floor(Math.random() * 10)
    };
  }
}
