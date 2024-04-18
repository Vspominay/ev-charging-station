import { inject, InjectionToken } from '@angular/core';
import { DepotClientService } from '@features/depot/data-access/depot.client';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { debounceTime, distinctUntilChanged, firstValueFrom, pipe, switchMap, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { TDepot, TDepotListItem } from './models/depot.model';

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
    delete: rxMethod<TDepot['id']>(
      pipe(
        switchMap((id) => {
          return Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#34c38f',
            cancelButtonColor: '#f46a6a',
            confirmButtonText: 'Yes, delete it!',
          }).then((result) => {
            if (!result.value) return;

            return firstValueFrom(client.delete(id));
          }).then(() => {
            patchState(store, {
              depots: store.depots().filter((depot) => depot.id !== id)
            });

            Swal.fire('Deleted!', 'Depot has been deleted.', 'success');
          });
        })
      )
    ),
    upsert: (depot: TDepotListItem) => {
      let isUpdated = false;
      const depots = store.depots().map((existDepot) => {
        if (existDepot.id === depot.id) {
          isUpdated = true;
          return { ...existDepot, ...depot };
        }

        return existDepot;
      });

      if (!isUpdated) depots.push(depot);

      patchState(store, { depots });
    }
  }))
);
