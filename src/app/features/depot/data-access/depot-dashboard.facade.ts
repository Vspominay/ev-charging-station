import { computed, inject, Injectable, Signal } from '@angular/core';

import { DepotStore } from '@features/depot/data-access/depot.store';
import { TDepot, TDepotListItem } from '@features/depot/data-access/models/depot.model';

@Injectable({
  providedIn: 'root'
})
export class DepotDashboardFacade {
  private readonly store = inject(DepotStore);

  readonly $viewModel: Signal<{ depot: TDepotListItem | null, isLoading: boolean }> = computed(() => {
    const { currentEntity, isLoading } = this.store;

    return {
      depot: currentEntity(),
      isLoading: isLoading()
    };
  });

  selectDepot(depotId: TDepot['id']) {
    this.store.loadById(depotId);
  }
}
