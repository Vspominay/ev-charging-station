import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AActionService } from '@core/abstractions/base-acitons.abstraction';
import { ChargerClientService } from '@features/chargers/data-access/chargers.client';
import { ChargersStore } from '@features/chargers/data-access/chargers.store';
import { ChargerRestart, TCharger } from '@features/chargers/data-access/models/charger.model';
import {
  SelectChargerRestartModePopupComponent
} from '@features/chargers/ui/components/select-charger-restart-mode-popup/select-charger-restart-mode-popup.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TActionsMap } from '@shared/utils/types/actions.types';
import { switchMap, take } from 'rxjs';

export enum ChargerAction {
  Restart = 'Restart',
  View = 'View',
  Delete = 'Delete'
}

@Injectable({
  providedIn: 'root'
})
export class ChargerActionsService extends AActionService<ChargerAction, TCharger, undefined> {
  private readonly router = inject(Router);
  private readonly store = inject(ChargersStore);
  private readonly modalService = inject(NgbModal);
  private readonly client = inject(ChargerClientService);

  protected readonly actionsMap: TActionsMap<ChargerAction, TCharger> = {
    [ChargerAction.View]: {
      label: 'base.buttons.view',
      handler: this.view.bind(this),
      data: undefined
    },
    [ChargerAction.Restart]: {
      label: 'base.buttons.restart',
      handler: this.restart.bind(this),
      data: undefined
    },
    [ChargerAction.Delete]: {
      label: 'base.buttons.delete',
      handler: this.delete.bind(this),
      data: undefined
    }
  };

  private view(charger: TCharger) {
    this.router.navigate(['depots', charger.depotId, 'chargers', charger.id, 'view']);
  }

  private restart(charger: TCharger) {
    const dialogRef = this.modalService.open(SelectChargerRestartModePopupComponent);

    dialogRef.closed
             .pipe(
               take(1),
               switchMap((restartMode: ChargerRestart) => this.client.restart(charger.id, restartMode))
             )
             .subscribe();
  }

  private delete(charger: TCharger) {
    this.store.deleteCharger(charger.id);
  }
}
