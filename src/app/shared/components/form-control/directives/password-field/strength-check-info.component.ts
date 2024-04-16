import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { TStrengthOption } from '@shared/components/form-control/directives/password-field/strength-check.directive';

@Component({
  selector: 'app-strength-check-info',
  standalone: true,
  template: `
      <div id="password-contain" class="p-3 bg-light mb-2 rounded">
          <h5 class="fs-13 fw-normal" [style.margin-bottom.px]="10">{{ label | translate }}</h5>

          @for (option of options;track option.label) {
              <p [innerHtml]="option.label | translate"
                 [ngClass]="option.isValid ? 'valid' : 'invalid'"
                 [ngStyle]="{
                  'margin-bottom': $last ? 0 : '10px'
                 }"
                 class="fs-13 icon-font-pseudo"></p>
          }
      </div>
  `,
  imports: [
    TranslateModule,
    NgClass,
    NgStyle
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StrengthCheckInfoComponent {
  @Input() label = 'base.password.validation.title';
  @Input() options: Array<Pick<TStrengthOption, 'label'> & { isValid: boolean }> = [];
}
