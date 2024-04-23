import { inject, InjectionToken } from '@angular/core';
import { createGenericStore } from '@core/abstractions/base-store.store';
import { DepotClientService } from '@features/depot/data-access/depot.client';
import { TDepotListItem } from './models/depot.model';

export const DEPOT_CLIENT_GATEWAY = new InjectionToken('DEPOT_CLIENT_GATEWAY', {
  providedIn: 'root',
  factory: () => inject(DepotClientService)
});

export const DepotStore = createGenericStore<TDepotListItem>(
  DEPOT_CLIENT_GATEWAY,
  'Depot'
);
