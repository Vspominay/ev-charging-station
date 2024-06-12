import { computed, inject, Injectable, Signal } from '@angular/core';
import { EventBus } from '@core/services/event-bus.service';
import {
  ChangeAvailabilityMessage, ChangeAvailabilityResponseStatus, ChargePointAutomaticDisableMessage, ChargerEvent
} from '@core/services/signalr.service';
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
import { DepotDashboardFacade } from '@features/depot/data-access/depot-dashboard.facade';
import { ChargerAction, ChargerActionsService } from '@features/depot/data-access/services/charger-actions.service';
import { IToastOptions, ToastService } from '@shared/components/toastr/toast-service';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChargersFacade {
  private readonly store = inject(ChargersStore);
  private readonly client = inject(ChargerClientService);
  private readonly eventBus = inject(EventBus);

  private readonly actionsService = inject(ChargerActionsService);
  private readonly chargerBarActions = inject(ChargersBarActionService);
  private readonly connectorActions = inject(ConnectorsActionsService);
  private readonly toastService = inject(ToastService);
  private $chargersWithConnectors = this.store.chargersWithConnectors;

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

  readonly $charger: Signal<TChargerWithConnectors | null> = this.store.selectedCharger;

  private readonly depotVm = inject(DepotDashboardFacade).$viewModel;
  private readonly $depotId = computed(() => this.depotVm().depot?.id);

  constructor() {
    this.listenConnectorChanges();
    this.listenConnectorAvailability();
    this.listenAutomaticDisable();
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
    this.store.loadCharger(chargerId);
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

    this.store.upsertCharger(chargerPayload);
    upsertResult$.pipe(take(1))
                 .subscribe({
                   next: (updatedCharger: TCharger) => {
                     this.store.upsertCharger(updatedCharger);
                   },
                   error: () => {
                     this.store.upsertCharger(fullCharger);
                   }
                 });
  }

  search(query: string) {
    this.store.search(query);
  }

  private listenConnectorChanges() {
    this.eventBus.on(ChargerEvent.Changes, (data: TConnectorChangeMessage) => {
      this.store.updateConnectorChargingStatus(data);
    });
  }

  private listenConnectorAvailability() {
    this.eventBus.on(ChargerEvent.ChangeAvailability, (data: ChangeAvailabilityMessage) => {
      const connector = data.connectorId && this.getConnectorInChargeStation(data.chargePointId, data.connectorId);
      if (!connector) return;

      const chargerName = this.getChargerNameById(data.chargePointId);
      if (!chargerName) return;

      const params = {
        connector: connector.connectorId,
        charger: chargerName
      };
      const { message, ...config } = this.getToastChangeAvailability(data.status);

      this.toastService.show(message, { ...config, params });
    });
  }

  private listenAutomaticDisable() {
    this.eventBus.on(ChargerEvent.AutomaticDisable, (data: ChargePointAutomaticDisableMessage) => {
      const isCurrentDepot = this.$depotId() === data.depotId;
      if (!isCurrentDepot) return;

      const chargerName = this.getChargerNameById(data.chargePointId);
      if (!chargerName) return;

      this.toastService.show('depot.list.alerts.automatic-disable', {
        style: 'warning',
        params: { charger: chargerName },
        iconName: 'power_off'
      });
    });
  }

  private getToastChangeAvailability(status: ChangeAvailabilityResponseStatus): IToastOptions & { message: string } {
    const configByStatus: Record<ChangeAvailabilityResponseStatus, IToastOptions & { message: string }> = {
      [ChangeAvailabilityResponseStatus.Accepted]: {
        message: 'connector.events.change-availability.accepted',
        style: 'success',
        iconName: 'check_circle'
      },
      [ChangeAvailabilityResponseStatus.Rejected]: {
        message: 'connector.events.change-availability.rejected',
        style: 'danger',
        iconName: 'block'
      },
      [ChangeAvailabilityResponseStatus.Scheduled]: {
        message: 'connector.events.change-availability.scheduled',
        style: 'info',
        iconName: 'short_stay'
      }
    };

    return configByStatus[status];
  }

  private getChargerNameById(chargerId: TCharger['id']) {
    return this.store.chargers().find((charger) => charger.id === chargerId)?.name;
  }

  private getConnectorInChargeStation(chargerId: TCharger['id'], connectorId: number) {
    return this.$chargersWithConnectors().find((charger) => charger.id === chargerId)?.connectors.find((connector) => connector.connectorId === connectorId);
  }
}
