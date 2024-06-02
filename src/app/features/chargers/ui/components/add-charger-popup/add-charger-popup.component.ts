import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DESCRIPTION_MAX_LENGTH, FIELD_MAX_LENGTH } from '@core/validators/field-max-length.validators';
import { trimRequiredValidator } from '@core/validators/trim-required.validator';
import { TChargerUpsert } from '@features/chargers/data-access/models/charger.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormElementDirective } from '@shared/components/form-control/directives/form-element.directive';
import { FormControlComponent } from '@shared/components/form-control/form-control.component';
import { IconDirective } from '@shared/directives/icon.directive';
import { getFormControlsNames } from '@shared/utils/get-form-controls-names.util';
import { ControlsOf } from '@shared/utils/types/controls-of.type';
import { FlatpickrModule } from 'angularx-flatpickr';

@Component({
  selector: 'ev-add-charger-popup',
  standalone: true,
  imports: [CommonModule, FlatpickrModule, FormControlComponent, FormElementDirective, IconDirective, ReactiveFormsModule, TranslateModule],
  templateUrl: './add-charger-popup.component.html',
  styles: ``
})
export class AddChargerPopupComponent {
  readonly dialog = inject(NgbActiveModal);
  private readonly fb = inject(NonNullableFormBuilder);

  @Input() labels!: Record<'label' | 'save', string>;

  upsertForm = this.fb.group<ControlsOf<TChargerUpsert>>({
    name: this.fb.control('', [trimRequiredValidator, FIELD_MAX_LENGTH]),
    description: this.fb.control('', [DESCRIPTION_MAX_LENGTH])
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
