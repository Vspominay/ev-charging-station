import { inject, Injectable } from '@angular/core';
import { TOcppTag, TUpsertOcppTag } from '@features/ocpp-tags/data-access/models/ocpp-tag.model';
import { OCPP_TAG_CLIENT_GATEWAY, OcppTagStore } from '@features/ocpp-tags/data-access/ocpp.store';
import { UpsertOcppTagComponent } from '@features/ocpp-tags/ui/components/upsert-ocpp-tag/upsert-ocpp-tag.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpsertTagService {
  private readonly modalService = inject(NgbModal);
  private readonly client = inject(OCPP_TAG_CLIENT_GATEWAY);
  private readonly store = inject(OcppTagStore);

  openUpsert(ocppTag: TOcppTag = {} as TOcppTag) {
    const dialogRef = this.modalService.open(UpsertOcppTagComponent, { size: 'md', centered: true });

    Object.assign(dialogRef.componentInstance, {
      ocppTag,
      labels: this.getLabels(Boolean(ocppTag.id))
    });

    dialogRef.closed
             .pipe(
               filter(Boolean),
               take(1),
               switchMap((ocpp: TUpsertOcppTag) => {
                 const ocppId = ocppTag.id;

                 return ocppId ?
                   this.client.update(ocppId, ocpp) :
                   this.client.create(ocpp);
               })
             )
             .subscribe({
               next: (ocpp: TOcppTag) => {
                 this.store.upsert(ocpp);
               }
             });
  }


  private getLabels(isUpsert: boolean): Record<'label' | 'save', string> {
    return {
      label: isUpsert ? 'Edit OCPP tag' : 'Create OCPP tag',
      save: isUpsert ? 'Save' : 'Create'
    };
  }
}
