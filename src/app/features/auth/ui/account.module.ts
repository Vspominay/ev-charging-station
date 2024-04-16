import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountRoutingModule } from './account-routing.module';


import { SigninModule } from './auth/signin/signin.module';

// Load Icons

@NgModule({
  declarations: [
    // RegisterComponent,
    // LoginComponent,
    // ToastsContainer
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbToastModule,
    AccountRoutingModule,
    SigninModule
  ],
})
export class AccountModule {
}
