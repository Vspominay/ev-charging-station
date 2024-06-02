import { Component, inject, Injector, Input, runInInjectionContext } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { DESCRIPTION_MAX_LENGTH, FIELD_MAX_LENGTH } from '@core/validators/field-max-length.validators';
import { trimRequiredValidator } from '@core/validators/trim-required.validator';
import { $chargers } from '@features/chargers/data-access/utils/get-all-chargers.util';
import { chargerConnectors$ } from '@features/chargers/data-access/utils/get-charger-connectors.util';
import { depotId } from '@features/depot/data-access/utils/get-depot-id.util';
import { $ocppTags } from '@features/ocpp-tags/data-access/utils/get-all-ocpp-tags.util';
import { TUpsertReservation } from '@features/reservations/data-access/models/reservation.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractUpsertEntityModalDirective } from '@shared/components/abstract-upsert-entity-modal.directive';
import { FormElementModule } from '@shared/components/form-control/form-control.module';
import { IconDirective } from '@shared/directives/icon.directive';
import { getFormControlsNames } from '@shared/utils/get-form-controls-names.util';
import { ControlsOf } from '@shared/utils/types/controls-of.type';
import { FlatpickrModule } from 'angularx-flatpickr';
import { switchMap } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'ev-upsert-reservation',
  standalone: true,
  imports: [FormElementModule, ReactiveFormsModule, TranslateModule, IconDirective, FlatpickrModule, NgSelectModule],
  templateUrl: './upsert-reservation.component.html',
  styles: ``,
})
export class UpsertReservationComponent extends AbstractUpsertEntityModalDirective<ControlsOf<TUpsertReservation>> {
  private readonly injector = inject(Injector);

  @Input() labels!: Record<'label' | 'save', string>;

  @Input() set reservation(value: TUpsertReservation) {
    this.upsertForm.patchValue(value);
  }

  private readonly depotId = depotId();
  readonly $ocppTags = $ocppTags();
  readonly $chargers = $chargers(this.depotId);

  readonly upsertForm = this.fb.group<ControlsOf<TUpsertReservation>>({
    name: this.fb.control('', [trimRequiredValidator, FIELD_MAX_LENGTH]),
    description: this.fb.control('', [DESCRIPTION_MAX_LENGTH]),
    startDateTime: this.fb.control(''),
    expiryDateTime: this.fb.control(''),
    connectorId: this.fb.control(null as any),
    chargePointId: this.fb.control(null as any),
    ocppTagId: this.fb.control(null as any),
  });
  formControlNames = getFormControlsNames(this.upsertForm);


  readonly $connectors = toSignal(this.upsertForm.controls.chargePointId.valueChanges
                                      .pipe(
                                        debounceTime(300),
                                        switchMap((chargerId) => chargerId ? runInInjectionContext(this.injector, () => chargerConnectors$(chargerId)) : [])
                                      ), { initialValue: [] });
}
