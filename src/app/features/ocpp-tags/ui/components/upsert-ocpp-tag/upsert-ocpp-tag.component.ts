import { Component, inject, Input } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { trimRequiredValidator } from '@core/validators/trim-required.validator';
import { TCreateOcppTag, TOcppTag } from '@features/ocpp-tags/data-access/models/ocpp-tag.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormElementDirective } from '@shared/components/form-control/directives/form-element.directive';
import { FormControlComponent } from '@shared/components/form-control/form-control.component';
import { IconDirective } from '@shared/directives/icon.directive';
import { getFormControlsNames } from '@shared/utils/get-form-controls-names.util';
import { ControlsOf } from '@shared/utils/types/controls-of.type';
import { FlatpickrModule } from 'angularx-flatpickr';
import dayjs from 'dayjs';

@Component({
  selector: 'ev-upsert-ocpp-tag',
  standalone: true,
  imports: [
    FormControlComponent,
    FormElementDirective,
    FormsModule,
    TranslateModule,
    IconDirective,
    ReactiveFormsModule,
    FlatpickrModule
  ],
  templateUrl: 'upsert-ocpp-tag.component.html',
})
export class UpsertOcppTagComponent {
  readonly dialog = inject(NgbActiveModal);
  private readonly fb = inject(NonNullableFormBuilder);

  @Input() labels!: Record<'label' | 'save', string>;

  @Input() set ocppTag(value: TOcppTag) {
    if (!value) return;

    this.upsertForm.patchValue(value);
  }

  upsertForm = this.fb.group<ControlsOf<TCreateOcppTag>>({
    tagId: this.fb.control('', [trimRequiredValidator]),
    parentTagId: this.fb.control(''),
    expiryDate: this.fb.control(dayjs().add(3, 'months').toISOString())
  });
  formControlNames = getFormControlsNames(this.upsertForm);

  saveChanges() {
    if (this.upsertForm.invalid) return;

    this.dialog.close(this.upsertForm.value);
  }

  close() {
    this.dialog.dismiss(false);
  }
}
