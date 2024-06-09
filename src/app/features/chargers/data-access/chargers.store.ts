import { computed, inject, InjectionToken, numberAttribute } from '@angular/core';

import { createGenericStore } from '@core/abstractions/base-store.store';
import { ChargerClientService } from '@features/chargers/data-access/chargers.client';
import { ConnectorClient } from '@features/chargers/data-access/connector.client';
import { TCharger, TChargerWithConnectors } from '@features/chargers/data-access/models/charger.model';
import {
  ConnectorStatus16, TConnectorChangeMessage, TConnectorView
} from '@features/chargers/data-access/models/connector.model';
import { TDepot } from '@features/depot/data-access/models/depot.model';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { filter, firstValueFrom, pipe, switchMap } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

export const CHARGERS_CLIENT_GATEWAY = new InjectionToken('CHARGERS_CLIENT_GATEWAY', {
  providedIn: 'root',
  factory: () => inject(ChargerClientService)
});

export const ChargerPointStore = createGenericStore<TCharger, any>(
  CHARGERS_CLIENT_GATEWAY,
  'Charger Point'
);

interface IChargerStore {
  chargers: Array<TCharger>,
  connectors: Array<TConnectorView>,
  selectedChargerId: TCharger['id'] | null,
  searchString: string;
  loaders: Record<'connectors' | 'chargers', boolean>
}

export const ChargersStore = signalStore(
  withState<IChargerStore>({
    chargers: [],
    connectors: [],
    selectedChargerId: null,
    searchString: '',
    loaders: {
      connectors: false,
      chargers: false
    }
  }),
  withComputed(({
    chargers: $chargers,
    connectors: $connectors,
    selectedChargerId: $selectedChargerId,
    searchString
  }) => ({
    chargersWithConnectors: computed(() => {
      const query = searchString();

      const chargers = query ? $chargers().filter((charger) => {
        return charger.name?.toLowerCase().includes(query.toLowerCase());
      }) : $chargers();

      return mapChargersWithConnectors(chargers, $connectors());
    }),
    connectorStatuses: computed(() => {
      return $connectors().reduce((acc, connector) => {
        const status = connector.currentStatus?.currentStatus ?? ConnectorStatus16.Unavailable;

        acc[status] += 1;

        return acc;
      }, (Object.values(ConnectorStatus16).reduce((acc, status) => {
        acc[status] = 0;

        return acc;
      }, {} as Record<ConnectorStatus16, number>)));
    }),
    energyUsage: computed(() => {
      return $connectors().reduce((acc, connector) => {
        acc += numberAttribute(connector.energy, 0);

        return acc;
      }, 0);
    }),
    selectedCharger: computed(() => {
      const selectedChargerId = $selectedChargerId();
      const selectedCharger = $chargers().find((charger) => charger.id === selectedChargerId);
      const storeConnectors = $connectors();

      if (!selectedCharger) return null;

      const connectors = storeConnectors.filter((connector) => connector.chargePointId === selectedCharger.id);
      return { ...selectedCharger, connectors };
    }),
  })),
  withMethods((
    store,
    chargerClient = inject(CHARGERS_CLIENT_GATEWAY),
    connectorClient = inject(ConnectorClient),
  ) => ({
    search: (query: string) => {
      patchState(store, { searchString: query });
    },
    loadChargers: rxMethod<TDepot['id']>(
      pipe(
        tap(() => {
          patchState(store, { loaders: { connectors: true, chargers: true } });
        }),
        switchMap((depotId) => chargerClient.getListByDepots([depotId])),
        tap((chargers) => {
          patchState(store, { chargers, loaders: { connectors: true, chargers: false } });
        }),
        switchMap((chargers) => connectorClient.getConnectorsByChargers(chargers.map((charger) => charger.id))),
        tap((connectors) => {
          patchState(store, { connectors, loaders: { connectors: false, chargers: false } });
        }),
      )
    ),
    loadCharger: rxMethod<TCharger['id']>(
      pipe(
        tap((chargerId) => {
          patchState(store, { selectedChargerId: chargerId });
        }),
        filter((chargerId) => {
          const chargers = store.chargers();
          const chargerExist = chargers.some((charger) => charger.id === chargerId);

          return !chargerExist;
        }),
        switchMap((chargerId) => chargerClient.getById(chargerId)),
        tap((charger) => {
          patchState(store, { chargers: [...store.chargers(), charger] });
        }),
        switchMap((charger) => connectorClient.getConnectorsByChargers([charger.id])),
        tap((connectors) => {
          patchState(store, { connectors: mergeConnectors(store.connectors(), connectors) });
        }),
      )
    ),
    deleteCharger: rxMethod<TCharger['id']>(
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

            return firstValueFrom(chargerClient.delete(id).pipe(map(() => id)));
          }).then((chargerId) => {
            const chargers = store.chargers().filter((charger) => charger.id !== chargerId);

            patchState(store, { chargers });

            Swal.fire('Deleted!', `Charger station has been deleted.`, 'success');
          });
        }),
      )
    ),
    updateConnectorChargingStatus: (data: TConnectorChangeMessage) => {
      const connector = store.connectors().find((connector) => connector.id === data.connectorId);

      if (!connector) {
        if (!environment.production) {
          console.warn(`Received connector charging message but connector not found: ${data.connectorId}`);
        }

        return;
      }

      const { currentStatus, ...connectorDetails } = connector;
      const updatedConnector: TConnectorView = {
        ...connectorDetails,
        currentStatus: {
          ...currentStatus,
          currentStatus: data.status ?? currentStatus?.currentStatus ?? ConnectorStatus16.Unavailable,
        } as TConnectorView['currentStatus'],
        soC: data.soC,
        energy: numberAttribute(data.energy, connectorDetails.energy ?? 0),
        power: numberAttribute(data.power, connectorDetails.power ?? 0),
        approximateChargingEndTime: data.approximateChargingEndTime
      };
      patchState(store, { connectors: mergeConnectors(store.connectors(), [updatedConnector]) });
    },
    addConnectorProfiles: (
      connectorId: TConnectorView['id'],
      chargingProfileIds: Array<TConnectorView['id']>
    ) => {
      const connector = store.connectors().find((connector) => connector.id === connectorId);
      if (!connector) return;

      connector.chargingProfilesIds = [...new Set([...connector.chargingProfilesIds ?? [], ...chargingProfileIds])];
      patchState(store, { connectors: mergeConnectors(store.connectors(), [connector]) });
    },
    removeConnectorProfiles: (
      connectorId: TConnectorView['id'],
      chargingProfileIds: Array<TConnectorView['id']>
    ) => {
      const connector = store.connectors().find((connector) => connector.id === connectorId);
      if (!connector) return;

      const profilesToRemove = new Set(chargingProfileIds);

      connector.chargingProfilesIds = (connector.chargingProfilesIds ?? []).filter((id) => !profilesToRemove.has(id));
      patchState(store, { connectors: mergeConnectors(store.connectors(), [connector]) });
    },
    upsertCharger: (charger: TCharger) => {
      let storeCharger = store.chargers().find((storeCharger) => storeCharger.id === charger.id);

      if (storeCharger) {
        storeCharger = { ...storeCharger, ...charger };
        patchState(store, { chargers: mergeChargers(store.chargers(), [storeCharger]) });
      } else {
        patchState(store, { chargers: [...store.chargers(), charger] });
      }
    }
  }))
);


function mapChargersWithConnectors($chargers: TCharger[], $connectors: TConnectorView[]): TChargerWithConnectors[] {
  const chargers = $chargers
    .reduce((acc, charger) => {
      const id = charger.id;

      acc[id] = { ...charger, connectors: [] };

      return acc;
    }, {} as Record<TCharger['id'], TChargerWithConnectors>);

  $connectors.forEach((connector) => {
    const charger = chargers[connector.chargePointId];

    if (charger) {
      charger.connectors = charger.connectors || [];
      charger.connectors.push(connector);
    }
  });

  return Object.values(chargers);
}

function mergeConnectors(currentConnectors: Array<TConnectorView>, newConnectors: Array<TConnectorView>): Array<TConnectorView> {
  const newConnectorsMap = new Map(newConnectors.map(connector => [connector.id, connector]));
  return currentConnectors.map((currentConnector) => newConnectorsMap.get(currentConnector.id) || currentConnector);
}

function mergeChargers(currentChargers: Array<TCharger>, newChargers: Array<TCharger>): Array<TCharger> {
  const newChargersMap = new Map(newChargers.map(charger => [charger.id, charger]));
  return currentChargers.map((currentCharger) => newChargersMap.get(currentCharger.id) || currentCharger);
}
