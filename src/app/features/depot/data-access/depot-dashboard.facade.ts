import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ChargersStore } from '@features/chargers/data-access/chargers.store';
import { TChargerWithConnectors } from '@features/chargers/data-access/models/charger.model';
import { ConnectorStatus16 } from '@features/chargers/data-access/models/connector.model';
import { DepotClientService } from '@features/depot/data-access/depot.client';

import { DepotStore } from '@features/depot/data-access/depot.store';
import { TDepot, TDepotListItem } from '@features/depot/data-access/models/depot.model';
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

  private readonly $chargers = this.chargerStore.chargersWithConnectors;
  private readonly $connectorStatuses = this.chargerStore.connectorStatuses;
  private readonly $energyUsage = this.chargerStore.energyUsage;

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

  selectDepot(depotId: TDepot['id']) {
    this.client.getById(depotId)
        .pipe(take(1))
        .subscribe((depot) => {
          this.store.setSelectedEntity(depot);

          if (depot.energyLimit) return;

          Swal.fire({
            title: 'Pay attention!',
            text: 'Depot requires energy consumption configuration',
            icon: 'warning',
            confirmButtonColor: '#34c38f',
            confirmButtonText: 'Ok, set it up',
            allowEscapeKey: false,
            allowOutsideClick: false,
          }).then((configureDepot) => {
            if (!configureDepot) return;

            this.router.navigate(['depots', depotId, 'configuration']);
          });
        });
    this.chargerStore.loadChargers(depotId);
  }
}
