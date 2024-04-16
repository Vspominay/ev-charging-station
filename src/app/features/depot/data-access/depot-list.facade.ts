import { computed, inject, Injectable } from '@angular/core';
import { DepotAction, DepotActionService } from '@features/depot/data-access/depot-action.service';
import { DepotStore } from '@features/depot/data-access/depot.store';
import { TDepotListItem } from '@features/depot/data-access/models/depot.model';

@Injectable({
  providedIn: 'root'
})
export class DepotListFacade {
  private readonly store = inject(DepotStore);
  private readonly actionService = inject(DepotActionService);


  readonly $actions = computed(() => {
    const actions = this.actionService.$actions();

    // TODO: add role-based actions filtering

    return actions;
  });

  readonly $viewModel = computed(() => {
    const { depots, isLoading } = this.store;

    return {
      depots: depots(),
      isLoading: isLoading()
    };
  });

  searchDepots(query: string) {
    this.store.loadByQuery(query);
  }

  handleAction(action: DepotAction, depot?: TDepotListItem) {
    this.actionService.handleAction(action, (depot || {}) as TDepotListItem);
  }
}
