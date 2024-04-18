import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TAddress } from '@core/types/address.type';
import { DESCRIPTION_MAX_LENGTH, FIELD_MAX_LENGTH } from '@core/validators/field-max-length.validators';
import { trimRequiredValidator } from '@core/validators/trim-required.validator';
import { TCreateDepot, TDepot } from '@features/depot/data-access/models/depot.model';
import { NgbActiveModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormElementModule } from '@shared/components/form-control/form-control.module';
import { IconDirective } from '@shared/directives/icon.directive';
import { getFormControlsNames } from '@shared/utils/get-form-controls-names.util';
import { ControlsOf } from '@shared/utils/types/controls-of.type';

type TUpsertDepotForm = Pick<TDepot, 'name' | 'phoneNumber' | 'email' | 'description' | 'energyLimit' | 'image'> & {
  address: TAddress;
};

@Component({
  selector: 'ev-upsert-depot',
  standalone: true,
  imports: [
    NgbNavModule,
    FormElementModule,
    ReactiveFormsModule,
    IconDirective,
    TranslateModule
  ],
  templateUrl: './upsert-depot.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsertDepotComponent {
  readonly dialog = inject(NgbActiveModal);
  private readonly fb = inject(NonNullableFormBuilder);

  @Input({ required: true }) set depot({ country, city, street, building, ...depot }: TDepot) {
    const address = { country, city, street, building };
    this.upsertForm.patchValue({
      ...depot,
      address
    });
  }

  @Input() labels!: Record<'label' | 'save', string>;

  readonly upsertForm = this.fb.group<ControlsOf<TUpsertDepotForm>>({
    name: this.fb.control('', [trimRequiredValidator, FIELD_MAX_LENGTH]),
    description: this.fb.control('', [DESCRIPTION_MAX_LENGTH]),
    email: this.fb.control('', [trimRequiredValidator, Validators.email]),
    phoneNumber: this.fb.control('', [FIELD_MAX_LENGTH]),
    image: this.fb.control(''),
    energyLimit: this.fb.control(0, [Validators.required, Validators.min(0)]),
    address: this.fb.group({
      country: this.fb.control('', [trimRequiredValidator]),
      city: this.fb.control('', [trimRequiredValidator]),
      street: this.fb.control('', [trimRequiredValidator]),
      building: this.fb.control('', [trimRequiredValidator]),
    })
  });

  readonly formControlNames = getFormControlsNames(this.upsertForm);
  readonly addressControlNames = getFormControlsNames(this.upsertForm.controls.address);

  onSubmit() {
    if (this.upsertForm.invalid) return;

    const payload = this.adaptDepot(this.upsertForm.value as TUpsertDepotForm);
    this.dialog.close(payload);
  }

  close() {
    this.dialog.dismiss(false);
  }

  private adaptDepot({ address, ...depot }: TUpsertDepotForm): TCreateDepot {
    return {
      ...depot,
      ...address,
    };
  }
}

