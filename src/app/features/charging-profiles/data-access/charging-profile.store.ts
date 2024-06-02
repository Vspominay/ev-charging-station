import { inject, InjectionToken } from '@angular/core';
import { createGenericStore } from '@core/abstractions/base-store.store';
import { ChargingProfileClient } from '@features/charging-profiles/data-access/charging-profile.cilent';
import { TChargingProfile } from '@features/charging-profiles/data-access/models/charging-profile.model';

export const CHARGING_PROFILE_CLIENT_GATEWAY = new InjectionToken('CHARGING_PROFILE_CLIENT_GATEWAY', {
  providedIn: 'root',
  factory: () => inject(ChargingProfileClient)
});

export const ChargingProfileStore = createGenericStore<TChargingProfile>(
  CHARGING_PROFILE_CLIENT_GATEWAY,
  'Charging Profile'
);
