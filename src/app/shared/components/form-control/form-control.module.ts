import { NgModule } from '@angular/core';
import { DynamicErrorMessageDirective } from '../form-control-error/dynamic-error-message.directive';
import { FormElementDirective } from './directives/form-element.directive';
import { FormControlComponent } from './form-control.component';

@NgModule({
  imports: [FormControlComponent, FormElementDirective, DynamicErrorMessageDirective],
  exports: [FormControlComponent, FormElementDirective, DynamicErrorMessageDirective]
})
export class FormElementModule {
}
