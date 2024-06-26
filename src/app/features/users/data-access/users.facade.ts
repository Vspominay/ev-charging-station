import { computed, inject, Injectable, Signal } from '@angular/core';
import { TListViewModel } from '@core/abstractions/base-store.store';
import { DepotDashboardFacade } from '@features/depot/data-access/depot-dashboard.facade';
import { TUser } from '@features/users/data-access/models/user.type';
import { UserAction, UsersActionsService } from '@features/users/data-access/serivces/users-actions.service';
import { UserStore } from '@features/users/data-access/users.store';
import { getSearchCriteria } from '@shared/utils/get-search-criteria.util';

@Injectable({
  providedIn: 'root'
})
export class UsersFacade {
  private readonly actionsService = inject(UsersActionsService);
  private readonly store = inject(UserStore);
  private readonly depotFacade = inject(DepotDashboardFacade);

  private readonly $depotId = computed(() => this.depotFacade.$viewModel().depot?.id);

  $actions = computed(() => {
    const actions = this.actionsService.$actions();

    return actions;
  });

  $vm: Signal<TListViewModel<TUser>> = this.store.viewModel;

  handleAction(action: UserAction, user: TUser | null) {
    this.actionsService.handleAction(action, user);
  }

  search(query = '') {
    this.store.loadAll({
      ...getSearchCriteria<TUser>(query, ['email']),
      depotId: this.$depotId()
    });
  }
}
