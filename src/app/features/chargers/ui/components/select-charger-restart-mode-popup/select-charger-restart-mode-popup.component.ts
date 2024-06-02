import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChargerRestart } from '@features/chargers/data-access/models/charger.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormElementDirective } from '@shared/components/form-control/directives/form-element.directive';
import { FormControlComponent } from '@shared/components/form-control/form-control.component';
import { IconDirective } from '@shared/directives/icon.directive';

@Component({
  selector: 'ev-select-charger-restart-mode-popup',
  standalone: true,
  imports: [
    FormControlComponent,
    FormElementDirective,
    IconDirective,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './select-charger-restart-mode-popup.component.html',
  styles: ``
})
export class SelectChargerRestartModePopupComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dialog = inject(NgbActiveModal);

  readonly restartMode = this.fb.control<ChargerRestart>(ChargerRestart.Soft);

  readonly restartModes = [
    {
      label: 'Soft Restart',
      value: ChargerRestart.Soft,
      details: 'Restarts communication with central system, for minor glitches. Maintains charging session'
    },
    {
      label: 'Hard Restart',
      value: ChargerRestart.Hard,
      details: 'Full reboot, erases all settings. Stops charging session, use only if unresponsive'
    },

  ];

  save() {
    if (this.restartMode.invalid) return;

    this.dialog.close(this.restartMode.value);
  }

  close() {
    this.dialog.close();
  }
}
