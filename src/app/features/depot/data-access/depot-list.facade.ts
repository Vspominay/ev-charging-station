import { computed, inject, Injectable } from '@angular/core';
import { $currentRole } from '@features/auth/utils/current-role.util';
import { DepotStore } from '@features/depot/data-access/depot.store';
import { TDepotListItem } from '@features/depot/data-access/models/depot.model';
import { DepotAction, DepotActionService } from '@features/depot/data-access/services/depot-action.service';
import { getSearchCriteria } from '@shared/utils/get-search-criteria.util';

@Injectable({
  providedIn: 'root'
})
export class DepotListFacade {
  private readonly store = inject(DepotStore);
  private readonly actionService = inject(DepotActionService);

  private readonly $role = $currentRole();

  readonly $actions = computed(() => {
    const actions = this.actionService.$actions();

    // TODO: uncomment befroe commit
    return actions;
    // return hasRole(this.$role(), ERole.SuperAdministrator) ? actions : [];
  });

  readonly $viewModel = computed(() => {
    const { entities, isLoading } = this.store;

    return {
      depots: entities(),
      isLoading: isLoading()
    };
  });

  searchDepots(query: string) {
    this.store.loadAll(getSearchCriteria<TDepotListItem>(query, ['name']));
  }

  handleAction(action: DepotAction, depot?: TDepotListItem) {
    this.actionService.handleAction(action, (depot || {}) as TDepotListItem);
  }
}
