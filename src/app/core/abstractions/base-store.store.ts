import { computed, inject, InjectionToken } from '@angular/core';
import { BaseCrudService } from '@core/services/base-crud.service';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { firstValueFrom, pipe } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

// Generic Entity Interface
export interface GenericEntity {
  id: string;
}

// Generic Store Interface
export interface GenericStore<T extends GenericEntity> {
  entities: T[];
  currentEntity: T | null;
  isLoading: boolean;
}

export type TListViewModel<T> = {
  entities: Array<T>,
  isLoading: boolean
};

// Generic Store Initial State
const initialState: GenericStore<any> = {
  entities: [],
  currentEntity: null,
  isLoading: false,
};

// Generic Store Factory
export function createGenericStore<T extends GenericEntity, TCreateEntity = T>(
  clientType: InjectionToken<BaseCrudService<T, TCreateEntity>>, // Your API client
  entityName: string // The name of the entity
) {
  return signalStore(
    withState<GenericStore<T>>(initialState),
    withComputed(({
      entities,
      isLoading
    }) => ({
      viewModel: computed<TListViewModel<T>>(() => ({
        entities: entities(),
        isLoading: isLoading()
      })),
    })),
    withMethods((store, client = inject(clientType)) => ({
      loadAll: rxMethod<Record<keyof Partial<T>, string> | {}>(
        pipe(
          debounceTime(300),
          distinctUntilChanged(),
          tap(() => patchState(store, { isLoading: true })),
          switchMap((params) => {
            return client.getList(params).pipe(
              tap({
                next: ({ collection: entities }) => patchState(store, { entities }),
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
            return client.getById(id).pipe(
              tap({
                next: (currentEntity) => patchState(store, { currentEntity }),
                error: console.error,
                finalize: () => patchState(store, { isLoading: false }),
              })
            );
          })
        )
      ),
      delete: rxMethod<T['id']>(
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
                entities: store.entities().filter((entity) => entity.id !== id)
              });

              Swal.fire('Deleted!', `${entityName} has been deleted.`, 'success');
            });
          })
        )
      ),
      localDelete: (id: T['id']) => {
        patchState(store, {
          entities: store.entities().filter((entity) => entity.id !== id)
        });
      },
      setSelectedEntity: (entity: T) => {
        patchState(store, { currentEntity: entity });
      },
      upsert: (entity: T) => {
        let isUpdated = false;
        const entities = store.entities().map((existingEntity) => {
          if (existingEntity.id === entity.id) {
            isUpdated = true;
            return { ...existingEntity, ...entity };
          }

          return existingEntity;
        });

        if (!isUpdated) entities.push(entity);

        patchState(store, { entities });
      }
    }))
  );
}
