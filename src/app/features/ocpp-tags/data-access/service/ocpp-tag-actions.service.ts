import { inject, Injectable } from '@angular/core';
import { AActionService } from '@core/abstractions/base-acitons.abstraction';
import { TOcppTag } from '@features/ocpp-tags/data-access/models/ocpp-tag.model';
import { OcppTagStore } from '@features/ocpp-tags/data-access/ocpp.store';
import { UpsertTagService } from '@features/ocpp-tags/data-access/service/upsert-tag.service';
import { TActionsMap, TActionWithIcon } from '@shared/utils/types/actions.types';

export enum TagAction {
  Edit = 'Edit',
  Create = 'Create',
  Delete = 'Delete'
}

@Injectable({
  providedIn: 'root'
})
export class OcppTagActionsService extends AActionService<TagAction, TOcppTag | null> {
  private readonly upsertService = inject(UpsertTagService);
  private readonly store = inject(OcppTagStore);

  readonly actionsMap: TActionsMap<TagAction, TOcppTag | null, TActionWithIcon> = {
      [TagAction.Create]: {
        label: 'base.buttons.create',
        handler: () => {
          this.upsertService.openUpsert();
        },
        data: {
          icon: 'add_circle',
          style: 'warning',
          position: 'bar'
        }
      },
      [TagAction.Edit] : {
        label: 'base.buttons.edit',
        handler: (tag) => {
          if (!tag) throw new Error('Tag is required to edit');

          this.upsertService.openUpsert(tag);
        },
        data: {
          icon: 'add_circle',
          style: 'warning',
          position: 'item'
        }
      },
    [TagAction.Delete] : {
        label: 'base.buttons.delete',
        handler: (tag) => {
          if (!tag) throw new Error('Tag is required to delete');

          this.store.delete(tag.id);
        },
        data: {
          icon: 'delete',
          style: 'danger',
          position: 'item'
        }
      }
    };
}
