import { inject, Injectable } from '@angular/core';
import { AActionService } from '@core/abstractions/base-acitons.abstraction';
import { TChargingProfile } from '@features/charging-profiles/data-access/models/charging-profile.model';
import {
  UpsertChargingProfileService
} from '@features/charging-profiles/data-access/services/upsert-charging-profile.service';
import { TActionsMap, TActionWithIcon } from '@shared/utils/types/actions.types';

export enum ChargingProfileBarAction {
  Create = 'Create'
}

@Injectable({
  providedIn: 'root'
})
export class ChargingProfileBarActionsService extends AActionService<ChargingProfileBarAction, TChargingProfile> {
  private readonly upsertService = inject(UpsertChargingProfileService);

  readonly actionsMap: TActionsMap<ChargingProfileBarAction, TChargingProfile, TActionWithIcon> = {
    [ChargingProfileBarAction.Create]: {
      label: 'base.buttons.create',
      handler: this.upsertService.openUpsertModal.bind(this.upsertService),
      data: {
        icon: 'add_circle',
        style: 'warning',
        position: 'bar'
      }
    }
  };
}
