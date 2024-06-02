import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base-crud.service';
import { ChargerRestart, TCharger } from '@features/chargers/data-access/models/charger.model';
import { TDepot } from '@features/depot/data-access/models/depot.model';

@Injectable({
  providedIn: 'root'
})
export class ChargerClientService extends BaseCrudService<TCharger, TCharger> {
  readonly domain = 'ChargePoint';

  getListByDepots(depotIds: Array<TDepot['id']>) {
    return this.http.get<Array<TCharger>>(`${this.fullUrl}/getbydepots`, {
      params: {
        depotsIds: depotIds.join('&depotsIds=')
      }
    });
  }

  restart(id: TCharger['id'], restartMode: ChargerRestart) {
    return this.http.post(`${this.fullUrl}/reset`, { chargePointId: id, resetType: restartMode });
  }
}
