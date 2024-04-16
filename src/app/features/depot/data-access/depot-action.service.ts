import { inject, Injectable } from '@angular/core';
import { AActionService } from '@core/abstractions/base-acitons.abstraction';
import { AddDepotStrategy } from '@features/depot/data-access/depot.strategies';
import { TDepotListItem } from '@features/depot/data-access/models/depot.model';
import { UpsertDepotComponent } from '@features/depot/ui/components/upsert-depot/upsert-depot.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TActionsMap, TActionWithIcon } from '@shared/utils/types/actions.types';
import { filter, take } from 'rxjs';

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
      handler: () => {},
      data: {
        icon: 'edit',
        style: 'primary',
        position: 'item'
      }
    },
    [DepotAction.Delete]: {
      label: 'base.buttons.delete',
      handler: () => {},
      data: {
        icon: 'delete',
        style: 'danger',
        position: 'item'
      }
    },
  };


  private createDepot() {
    const dialogRef = this.dialog.open(UpsertDepotComponent);

    const strategy = new AddDepotStrategy();

    strategy.initialValue$
            .pipe()
            .subscribe((depot) => {
              Object.assign(dialogRef.componentInstance, {
                labels: strategy.labels,
                depot
              });
            });


    dialogRef.closed
             .pipe(
               filter(Boolean),
               take(1)
             )
             .subscribe((depot) => {
               console.log(depot);
             });

  }

  private deleteDepot() {

  }
}
