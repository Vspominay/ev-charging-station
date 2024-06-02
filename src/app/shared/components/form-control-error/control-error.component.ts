import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorMessagePipe } from './error-message.pipe';

@Component({
  selector: 'app-control-error',
  standalone: true,
  imports: [
    KeyValuePipe,
    ErrorMessagePipe,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (error of (errors | keyvalue); track error.key) {
      @if (error.key | errorMessage:error.value; as messageConfig) {
        <div [translate]="messageConfig.message"
             [translateParams]="messageConfig.params"
             class="animated-message mt-0 form-text text-danger">
        </div>
      }
    }`,
  styles: [
    `
      :host {
        display: block;
        //position: absolute;
      }
    `
  ]
})
export class ControlErrorComponent {
  @Input()
  errors: ValidationErrors = {};
}
