import { inject, InjectionToken } from '@angular/core';
import { DepotClientService } from '@features/depot/data-access/depot.client';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { TDepotListItem } from './models/depot.model';

export const DEPOT_CLIENT_GATEWAY = new InjectionToken('CLIENT_GATEWAY', {
  providedIn: 'root',
  factory: () => inject(DepotClientService)
});

interface DepotStore {
  depots: Array<TDepotListItem>;
  currentDepot: TDepotListItem | null;
  isLoading: boolean;
}

const initialState: DepotStore = {
  depots: [],
  currentDepot: null,
  isLoading: false
};

export const DepotStore = signalStore(
  withState<DepotStore>(initialState),
  withMethods((store, client = inject(DEPOT_CLIENT_GATEWAY)) => ({
    loadByQuery: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, { isLoading: true })),
        switchMap((query) => {
          return client.loadList(query).pipe(
            tap({
              next: (depots) => patchState(store, { depots }),
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),
    loadById: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => {
          return client.loadById(id).pipe(
            tap({
              next: (currentDepot) => patchState(store, { currentDepot }),
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),
  }))
);
