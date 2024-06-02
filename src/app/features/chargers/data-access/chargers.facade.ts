import { computed, inject, Injectable, Signal } from '@angular/core';
import { EventBus } from '@core/services/event-bus.service';
import { ChargerEvent } from '@core/services/signalr.service';
import { ChargerClientService } from '@features/chargers/data-access/chargers.client';
import { ChargersStore } from '@features/chargers/data-access/chargers.store';
import { TCharger, TChargerUpsert, TChargerWithConnectors } from '@features/chargers/data-access/models/charger.model';
import { TConnectorChangeMessage, TConnectorView } from '@features/chargers/data-access/models/connector.model';
import {
  ChargersBarAction, ChargersBarActionService
} from '@features/chargers/data-access/services/chargers-bar-actions.service';
import {
  ConnectorAction, ConnectorsActionsService
} from '@features/chargers/data-access/services/connectors-actions.service';
import { ChargerAction, ChargerActionsService } from '@features/depot/data-access/services/charger-actions.service';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChargersFacade {
  private readonly chargerStore = inject(ChargersStore);
  private readonly client = inject(ChargerClientService);
  private readonly eventBus = inject(EventBus);

  private readonly actionsService = inject(ChargerActionsService);
  private readonly chargerBarActions = inject(ChargersBarActionService);
  private readonly connectorActions = inject(ConnectorsActionsService);

  readonly $actions = computed(() => {
    const actions = this.actionsService.$actions();
    const barActions = this.chargerBarActions.$actions();
    const connector = this.connectorActions.$actions();

    // TODO: add role-based actions filtering
    return {
      card: actions,
      bar: barActions,
      connector
    };
  });

  readonly $charger: Signal<TChargerWithConnectors | null> = this.chargerStore.selectedCharger;

  constructor() {
    this.listenConnectorChanges();
  }

  handleCarAction(action: ChargerAction, charger?: TCharger) {
    this.actionsService.handleAction(action, (charger || {}) as TCharger);
  }

  handleBarAction(action: ChargersBarAction) {
    this.chargerBarActions.handleAction(action, undefined);
  }

  handleConnectorAction(action: ConnectorAction, connector: TConnectorView) {
    this.connectorActions.handleAction(action, connector);
  }

  loadCharger(chargerId: TCharger['id']) {
    this.chargerStore.loadCharger(chargerId);
  }

  upsertCharger(
    upsertCharger: TChargerUpsert,
    fullCharger: TCharger
  ) {
    const chargerId = upsertCharger.id;
    const chargerPayload = {
      ...fullCharger,
      ...upsertCharger
    };
    const upsertResult$ = chargerId ?
      this.client.update(chargerId, chargerPayload) :
      this.client.create(chargerPayload);

    this.chargerStore.upsertCharger(chargerPayload);
    upsertResult$.pipe(take(1))
                 .subscribe({
                   next: (updatedCharger: TCharger) => {
                     this.chargerStore.upsertCharger(updatedCharger);
                   },
                   error: () => {
                     this.chargerStore.upsertCharger(fullCharger);
                   }
                 });
  }

  search(query: string) {
    this.chargerStore.search(query);
  }

  private listenConnectorChanges() {
    this.eventBus.on(ChargerEvent.Changes, (data: TConnectorChangeMessage) => {
      this.chargerStore.updateConnectorChargingStatus(data);
    });
  }
}
