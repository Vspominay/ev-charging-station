import { inject, Injectable } from '@angular/core';
import { AActionService } from '@core/abstractions/base-acitons.abstraction';
import { TChargingProfile } from '@features/charging-profiles/data-access/models/charging-profile.model';
import {
  UpsertChargingProfileService
} from '@features/charging-profiles/data-access/services/upsert-charging-profile.service';
import { TActionsMap, TActionWithIcon } from '@shared/utils/types/actions.types';

export enum ChargingProfileAction {
  Edit = 'Edit'
}

@Injectable({
  providedIn: 'root'
})
export class ChargingProfileActionsService extends AActionService<ChargingProfileAction, TChargingProfile> {
  private readonly upsertService = inject(UpsertChargingProfileService);

  readonly actionsMap: TActionsMap<ChargingProfileAction, TChargingProfile, TActionWithIcon> = {
    [ChargingProfileAction.Edit]: {
      label: 'base.buttons.view',
      handler: this.upsertService.openUpsertModal.bind(this.upsertService),
      data: {
        icon: 'add_circle',
        style: 'warning',
        position: 'bar'
      }
    }
  };
}
