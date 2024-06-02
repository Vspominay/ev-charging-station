import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ChargingProfileFacade } from '@features/charging-profiles/data-access/charging-profile.facade';
import { of } from 'rxjs';

export const chargingProfilesLoader: ResolveFn<null> = () => {
  inject(ChargingProfileFacade).loadProfiles();

  return of(null);
};
