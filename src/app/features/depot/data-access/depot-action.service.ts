import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { AActionService } from '@core/abstractions/base-acitons.abstraction';
import { DepotClientService } from '@features/depot/data-access/depot.client';
import { DepotStore } from '@features/depot/data-access/depot.store';
import { AddDepotStrategy, AUpsertDepot, EditDepotStrategy } from '@features/depot/data-access/depot.strategies';
import { TDepot, TDepotListItem } from '@features/depot/data-access/models/depot.model';
import { UpsertDepotComponent } from '@features/depot/ui/components/upsert-depot/upsert-depot.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TActionsMap, TActionWithIcon } from '@shared/utils/types/actions.types';
import { filter, switchMap, take } from 'rxjs';

export enum DepotAction {
  Create = 'Create',
  Delete = 'Delete',
  Edit = 'Edit',
}

@Injectable({
  providedIn: 'root'
})
export class DepotActionService extends AActionService<DepotAction, TDepotListItem> {
  private readonly dialog = inject(NgbModal);
  private readonly depotClient = inject(DepotClientService);
  private injector = inject(Injector);
  private readonly store = inject(DepotStore);


  protected readonly actionsMap: TActionsMap<DepotAction, TDepotListItem, TActionWithIcon> = {
    [DepotAction.Create]: {
      label: 'base.buttons.create',
      handler: this.createDepot.bind(this),
      data: {
        icon: 'add_circle',
        style: 'warning',
        position: 'bar'
      }
    },
    [DepotAction.Edit]: {
      label: 'base.buttons.edit',
      handler: this.editDepot.bind(this),
      data: {
        icon: 'edit',
        style: 'primary',
        position: 'item'
      }
    },
    [DepotAction.Delete]: {
      label: 'base.buttons.delete',
      handler: this.deleteDepot.bind(this),
      data: {
        icon: 'delete',
        style: 'danger',
        position: 'item'
      }
    },
  };


  private createDepot() {
    const strategy = runInInjectionContext(this.injector, () => new AddDepotStrategy());

    this.upsertDepot(strategy);
  }

  private deleteDepot({ id }: TDepot) {
    this.store.delete(id);
  }

  private editDepot(depot: TDepot) {
    const strategy = runInInjectionContext(this.injector, () => new EditDepotStrategy(depot.id));

    this.upsertDepot(strategy, depot);
  }

  private upsertDepot(strategy: AUpsertDepot, depot?: TDepot) {
    const dialogRef = this.dialog.open(UpsertDepotComponent);

    console.log(strategy);

    Object.assign(dialogRef.componentInstance, {
      depot: depot || {},
      labels: strategy.labels
    });

    dialogRef.closed
             .pipe(
               filter(Boolean),
               take(1),
               switchMap((depot) => strategy.save(depot))
             )
             .subscribe({
               next: (result) => {
                 this.store.upsert({
                   ...result,
                   chargerStats: {
                     online: 0,
                     offline: 0,
                     faulted: 0,
                   }
                 });
               },
               error: (error) => {
                 console.warn(error);
               }
             });
  }
}
