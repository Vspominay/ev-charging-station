import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { OCPP_TAG_CLIENT_GATEWAY } from '@features/ocpp-tags/data-access/ocpp.store';
import { map } from 'rxjs/operators';

export const $ocppTags = () => {
  const client = inject(OCPP_TAG_CLIENT_GATEWAY);

  return toSignal(client.getList().pipe(map(({ collection }) => collection)), { initialValue: [] });
};
