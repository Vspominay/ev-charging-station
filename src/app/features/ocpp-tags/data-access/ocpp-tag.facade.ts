import { computed, inject, Injectable } from '@angular/core';
import { TOcppTag } from '@features/ocpp-tags/data-access/models/ocpp-tag.model';
import { OcppTagStore } from '@features/ocpp-tags/data-access/ocpp.store';
import { OcppTagActionsService, TagAction } from '@features/ocpp-tags/data-access/service/ocpp-tag-actions.service';
import { getSearchCriteria } from '@shared/utils/get-search-criteria.util';

@Injectable({
  providedIn: 'root'
})
export class OcppTagFacade {
  private readonly actionsService = inject(OcppTagActionsService);
  private readonly store = inject(OcppTagStore);

  readonly $actions = computed(() => {
    const actions = this.actionsService.$actions();

    return actions
  });

  readonly $vm = this.store.viewModel;

  handleAction(action: TagAction, tag: TOcppTag | null) {
    this.actionsService.handleAction(action, tag);
  }

  search(query: string) {
    this.store.loadAll(getSearchCriteria<TOcppTag>(query, ['tagId']));
  }
}
