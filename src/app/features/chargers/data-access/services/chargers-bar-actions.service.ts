import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AActionService } from '@core/abstractions/base-acitons.abstraction';
import { ChargerClientService } from '@features/chargers/data-access/chargers.client';
import { ChargersStore } from '@features/chargers/data-access/chargers.store';
import { TCharger, TChargerUpsert } from '@features/chargers/data-access/models/charger.model';
import {
  AddChargerPopupComponent
} from '@features/chargers/ui/components/add-charger-popup/add-charger-popup.component';
import { DepotDashboardFacade } from '@features/depot/data-access/depot-dashboard.facade';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TActionsMap, TActionWithIcon } from '@shared/utils/types/actions.types';
import { filter, switchMap, take } from 'rxjs';

export enum ChargersBarAction {
  Create = 'Create'
}

@Injectable({
  providedIn: 'root'
})
export class ChargersBarActionService extends AActionService<ChargersBarAction, undefined> {
  private readonly modalService = inject(NgbModal);
  private readonly client = inject(ChargerClientService);
  private readonly store = inject(ChargersStore);
  private readonly $depot = inject(DepotDashboardFacade).$viewModel;
  private readonly router = inject(Router);

  readonly actionsMap: TActionsMap<ChargersBarAction, undefined, TActionWithIcon> = {
    [ChargersBarAction.Create]: {
      label: 'base.buttons.create',
      handler: this.create.bind(this),
      data: {
        icon: 'add_circle',
        style: 'warning',
        position: 'bar'
      }
    }
  };

  private create() {
    const dialogRef = this.modalService.open(AddChargerPopupComponent);

    Object.assign(dialogRef.componentInstance, {
      labels: {
        label: 'Add charger',
        save: 'Save'
      }
    });

    dialogRef.closed
             .pipe(
               filter(Boolean),
               take(1),
               switchMap((upsertCharger: TChargerUpsert) => this.client.create({
                   ...upsertCharger,
                   depotId: this.$depot().depot?.id!
                 } as TCharger
               ))
             )
             .subscribe((charger: TCharger) => {
               this.store.upsertCharger(charger);
               this.router.navigate([
                 'depots',
                 charger.depotId,
                 'chargers',
                 charger.id,
                 'view'
               ]);
             });
  }
}
