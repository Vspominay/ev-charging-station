import { Injectable } from '@angular/core';
import { BaseCrudService } from '@core/services/base-crud.service';
import { TConnectorView } from '@features/chargers/data-access/models/connector.model';
import {
  TChargingProfile, TUpsertChargingProfile
} from '@features/charging-profiles/data-access/models/charging-profile.model';

@Injectable({
  providedIn: 'root'
})
export class ChargingProfileClient extends BaseCrudService<TChargingProfile, TUpsertChargingProfile> {
  readonly domain = 'ChargingProfile';

  applyChargingProfile(connectorId: TConnectorView['id'], chargingProfileId: TChargingProfile['id']) {
    return this.http.post(`${this.fullUrl}/set`, { connectorId, chargingProfileId });
  }

  clearChargingProfileFromConnector(connectorId: TConnectorView['id'], chargingProfileId: TChargingProfile['id']) {
    return this.http.post(`${this.fullUrl}/clear`, { connectorId, chargingProfileId });
  }
}
