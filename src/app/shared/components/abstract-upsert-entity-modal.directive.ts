import { Directive, inject } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Directive({
  standalone: true
})
export abstract class AbstractUpsertEntityModalDirective<TForm extends { [K in keyof TForm]: AbstractControl<any, any>; }> {
  readonly dialog = inject(NgbActiveModal);
  protected readonly fb = inject(NonNullableFormBuilder);

  abstract upsertForm: FormGroup<TForm>;

  saveChanges() {
    if (this.upsertForm.invalid) return;

    this.dialog.close(this.upsertForm.value);
  }

  close() {
    this.dialog.dismiss(false);
  }
}
