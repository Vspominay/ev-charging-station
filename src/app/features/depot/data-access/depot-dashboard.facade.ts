import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EventBus } from '@core/services/event-bus.service';
import {
  DepotEvent, EnergyLimitExceededMessage, TransactionEvent, TransactionMessage
} from '@core/services/signalr.service';
import { ChargersStore } from '@features/chargers/data-access/chargers.store';
import { TChargerWithConnectors } from '@features/chargers/data-access/models/charger.model';
import { ConnectorStatus16 } from '@features/chargers/data-access/models/connector.model';
import { DepotClientService } from '@features/depot/data-access/depot.client';

import { DepotStore } from '@features/depot/data-access/depot.store';
import { TDepot, TDepotListItem } from '@features/depot/data-access/models/depot.model';
import { getCurrentInterval } from '@features/depot/utils/get-current-interval.util';
import { ToastService } from '@shared/components/toastr/toast-service';
import { EnergyPipe } from '@shared/pipes/energy.pipe';
import { take } from 'rxjs';
import Swal from 'sweetalert2';

type TDepotViewModel = {
  depot: TDepotListItem | null,
  connectorStatuses: Record<ConnectorStatus16, number>,
  chargers: TChargerWithConnectors[],
  loaders: Record<'depot' | 'connectors' | 'chargers', boolean>,
  energyUsage: number;
};

@Injectable({
  providedIn: 'root'
})
export class DepotDashboardFacade {
  private readonly store = inject(DepotStore);
  private readonly chargerStore = inject(ChargersStore);
  private readonly client = inject(DepotClientService);
  private router = inject(Router);
  private eventBus = inject(EventBus);
  private toastService = inject(ToastService);

  private readonly energyPipe = new EnergyPipe();

  private readonly $chargers = this.chargerStore.chargersWithConnectors;
  private readonly $connectorStatuses = this.chargerStore.connectorStatuses;
  private readonly $energyUsage = this.chargerStore.energyUsage;
  private $chargersWithConnectors = this.chargerStore.chargersWithConnectors;

  readonly $viewModel = computed<TDepotViewModel>(() => {
    const { currentEntity, isLoading } = this.store;
    const loaders = this.chargerStore.loaders();

    return {
      depot: currentEntity(),
      connectorStatuses: this.$connectorStatuses(),
      chargers: this.$chargers(),
      loaders: {
        depot: isLoading(),
        ...loaders
      },
      energyUsage: this.$energyUsage()
    };
  });

  constructor() {
    this.listenEnergyLimitExceeded();
    this.listenTransactionChanges();
  }

  selectDepot(depotId: TDepot['id']) {
    this.store.setSelectedEntity({ id: depotId } as TDepotListItem);

    this.client.getById(depotId)
        .pipe(take(1))
        .subscribe((depot) => {
          this.store.setSelectedEntity(depot);

          if (!depot.energyLimit) {
            this.showConfigureDepotModal('Depot requires energy consumption configuration', depotId);
            return;
          }

          const currentInterval = getCurrentInterval(depot);
          if (!currentInterval) {
            this.showConfigureDepotModal('Depot configuration is outdated. Please set it up', depotId);
          }
        });
    this.chargerStore.loadChargers(depotId);
  }

  private listenEnergyLimitExceeded() {
    return this.eventBus.on(DepotEvent.EnergyLimitExceeded, (data: EnergyLimitExceededMessage) => {
      const isOpenedDepot = this.$viewModel().depot?.id === data.depotId;
      if (!isOpenedDepot) return;

      this.toastService.show('depot.list.alerts.energy-limit-reached', {
        params: {
          actual: this.energyPipe.transform(data.energyConsumption),
          total: this.energyPipe.transform(data.energyConsumptionLimit)
        },
        style: 'danger',
        iconName: 'running_with_errors'
      });
    });
  }

  private listenTransactionChanges() {
    return this.eventBus.on(TransactionEvent.Transaction, (data: TransactionMessage) => {
      const connector = this.chargerStore.connectors().find((connector) => connector.id === data.connectorId);
      if (!connector) return;

      const charger = this.$chargersWithConnectors().find((charger) => charger.id === connector.chargePointId);
      if (!charger) return;

      const message = 'transactions.events.connector';
      const params = { connector: connector.connectorId, charger: charger.name };

      this.toastService.show(message, { style: 'info', iconName: 'contactless', params });
    });
  }

  private showConfigureDepotModal(message: string, depotId: string) {
    Swal.fire({
      title: 'Pay attention!',
      text: message,
      icon: 'warning',
      confirmButtonColor: '#34c38f',
      confirmButtonText: 'Ok, set it up',
      allowEscapeKey: false,
      allowOutsideClick: false,
    }).then((configureDepot) => {
      if (!configureDepot) return;

      this.router.navigate(['depots', depotId, 'configuration']);
    });
  }
}
