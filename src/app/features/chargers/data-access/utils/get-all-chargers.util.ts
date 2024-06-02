import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { CHARGERS_CLIENT_GATEWAY } from '@features/chargers/data-access/chargers.store';
import { TDepot } from '@features/depot/data-access/models/depot.model';

import { map } from 'rxjs/operators';

export const $chargers = (depotId?: TDepot['id']) => {
  const client = inject(CHARGERS_CLIENT_GATEWAY);
  const activatedRoute = inject(ActivatedRoute);

  if (!depotId) {
    depotId = activatedRoute.snapshot.params['depotId'];
  }

  return toSignal(client.getList({ depotId }).pipe(map(({ collection }) => collection)), { initialValue: [] });
};
