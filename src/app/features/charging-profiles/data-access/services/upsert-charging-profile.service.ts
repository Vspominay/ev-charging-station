import { inject, Injectable } from '@angular/core';
import { ChargingProfileClient } from '@features/charging-profiles/data-access/charging-profile.cilent';
import { ChargingProfileStore } from '@features/charging-profiles/data-access/charging-profile.store';
import {
  TChargingProfile, TUpsertChargingProfile
} from '@features/charging-profiles/data-access/models/charging-profile.model';
import {
  UpsertChargingProfileComponent
} from '@features/charging-profiles/ui/components/upsert-charging-profile/upsert-charging-profile.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter, take } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UpsertChargingProfileService {
  private readonly modalService = inject(NgbModal);
  private readonly store = inject(ChargingProfileStore);
  private readonly client = inject(ChargingProfileClient);

  openUpsertModal(profile?: TChargingProfile) {
    const dialogRef = this.modalService.open(UpsertChargingProfileComponent, {
      size: 'xl'
    });

    Object.assign(dialogRef.componentInstance, {
      profile,
      labels: this.getLabels(Boolean(profile?.id))
    });

    dialogRef.closed
             .pipe(
               filter(Boolean),
               take(1),
               tap((profile) => console.log('profile: ', profile)),
               switchMap((upsertProfile: TUpsertChargingProfile) => this.client.create(upsertProfile))
             )
             .subscribe((profile: TChargingProfile) => {
               this.store.upsert(profile);
             });
  }



  private getLabels(isExistDepot: boolean): Record<'label' | 'save', string> {
    const label = isExistDepot ? 'profile.upsert.edit' : 'profile.upsert.add';
    const save = isExistDepot ? 'base.buttons.close' : 'base.buttons.create';

    return { label, save };
  }
}
