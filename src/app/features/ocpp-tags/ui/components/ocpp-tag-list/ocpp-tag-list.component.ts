import { DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TCreateOcppTag, TOcppTag } from '@features/ocpp-tags/data-access/models/ocpp-tag.model';
import { OCPP_TAG_CLIENT_GATEWAY, OcppTagStore } from '@features/ocpp-tags/data-access/ocpp.store';
import { UpsertOcppTagComponent } from '@features/ocpp-tags/ui/components/upsert-ocpp-tag/upsert-ocpp-tag.component';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbsComponent } from '@shared/components/breadcrumbs/breadcrumbs.component';
import { FormElementDirective } from '@shared/components/form-control/directives/form-element.directive';
import { FormControlComponent } from '@shared/components/form-control/form-control.component';
import { BadgeDirective } from '@shared/directives/badge.directive';
import { IconDirective } from '@shared/directives/icon.directive';
import { EmptyValuePipe } from '@shared/pipes/empty-value.pipe';
import { filter, switchMap, take } from 'rxjs';

@Component({
  selector: 'ev-ocpp-tag-list',
  standalone: true,
  imports: [
    BreadcrumbsComponent,
    DatePipe,
    FormControlComponent,
    FormElementDirective,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    EmptyValuePipe,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    BadgeDirective,
    TranslateModule,
    IconDirective
  ],
  templateUrl: 'ocpp-tag-list.component.html',
})
export default class OcppTagListComponent {
  private readonly store = inject(OcppTagStore);
  private readonly client = inject(OCPP_TAG_CLIENT_GATEWAY);
  private readonly dialogService = inject(NgbModal);

  readonly $tags: Signal<Array<TOcppTag>> = this.store.entities;

  openUpsert(ocppTag: TOcppTag = {} as TOcppTag) {
    const dialogRef = this.dialogService.open(UpsertOcppTagComponent, { size: 'md', centered: true });

    Object.assign(dialogRef.componentInstance, {
      ocppTag,
      labels: this.getLabels(Boolean(ocppTag.id))
    });

    dialogRef.closed
             .pipe(
               filter(Boolean),
               take(1),
               switchMap((ocpp: TCreateOcppTag) => {
                 const ocppId = ocppTag.id;

                 console.log(ocppId);

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

  delete(tag: TOcppTag) {
    this.store.delete(tag.id);
  }

  private getLabels(isUpsert: boolean): Record<'label' | 'save', string> {
    return {
      label: isUpsert ? 'Edit OCPP тег' : 'Create OCPP tag',
      save: isUpsert ? 'Save' : 'Create'
    };
  }
}
