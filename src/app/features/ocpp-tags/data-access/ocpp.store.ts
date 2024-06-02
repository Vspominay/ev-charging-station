import { inject, InjectionToken } from '@angular/core';
import { createGenericStore } from '@core/abstractions/base-store.store';
import { TOcppTag, TUpsertOcppTag } from '@features/ocpp-tags/data-access/models/ocpp-tag.model';
import { OcppTagClientService } from '@features/ocpp-tags/data-access/ocpp-tag.client';

export const OCPP_TAG_CLIENT_GATEWAY = new InjectionToken('OCPP_TAG_CLIENT_GATEWAY', {
  providedIn: 'root',
  factory: () => inject(OcppTagClientService)
});

export const OcppTagStore = createGenericStore<TOcppTag, TUpsertOcppTag>(
  OCPP_TAG_CLIENT_GATEWAY,
  'OCPP Tag'
);
