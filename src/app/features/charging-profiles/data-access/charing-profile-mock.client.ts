import { Injectable } from '@angular/core';
import { BaseCrudService, TListResponse } from '@core/services/base-crud.service';
import {
  TChargingProfile, TUpsertChargingProfile
} from '@features/charging-profiles/data-access/models/charging-profile.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChargingProfileMockClient extends BaseCrudService<TChargingProfile, TUpsertChargingProfile> {
  readonly domain = 'ChargingProfile';

  override getList(params?: Partial<TChargingProfile>): Observable<TListResponse<TChargingProfile>> {
    return this.http.get<TListResponse<TChargingProfile>>('assets/api/profiles.json');
  }
}
