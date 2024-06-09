import { TitleCasePipe } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { PHONE_MASK } from '@core/constants/phone-mask.constant';
import { strongPasswordValidator } from '@core/constants/strong-password.validator';
import { emailValidator } from '@core/validators/email.validator';
import { FIELD_MAX_LENGTH } from '@core/validators/field-max-length.validators';
import { trimRequiredValidator } from '@core/validators/trim-required.validator';
import { TRegisterRequest } from '@features/auth/data-access/models/register.model';
import { ERole } from '@features/auth/data-access/models/roles.enum';
import { RoleOptions, UserStatusOptions } from '@features/users/constants/user.constants';
import { TUser } from '@features/users/data-access/models/user.type';
import { UsersClient } from '@features/users/data-access/users.client';
import { UserLabelPipe } from '@features/users/ui/pipes/user-label.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractUpsertEntityModalDirective } from '@shared/components/abstract-upsert-entity-modal.directive';
import {
  PasswordFieldDirective
} from '@shared/components/form-control/directives/password-field/password-field.directive';
import {
  StrengthCheckDirective
} from '@shared/components/form-control/directives/password-field/strength-check.directive';
import { FormElementModule } from '@shared/components/form-control/form-control.module';
import { IconDirective } from '@shared/directives/icon.directive';
import { VcrContainerDirective } from '@shared/directives/vcr-container.directive';
import { getFormControlsNames } from '@shared/utils/get-form-controls-names.util';
import { ControlsOf } from '@shared/utils/types/controls-of.type';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxMaskDirective } from 'ngx-mask';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

type TUserListControl = { entities: Array<TUser>, page: number, isLastPage?: boolean };

@Component({
  selector: 'ev-invite-user-popup',
  standalone: true,
  imports: [
    FlatpickrModule,
    FormElementModule,
    IconDirective,
    NgSelectModule,
    ReactiveFormsModule,
    TranslateModule,
    UserLabelPipe,
    TitleCasePipe,
    PasswordFieldDirective,
    StrengthCheckDirective,
    VcrContainerDirective,
    NgxMaskDirective
  ],
  templateUrl: 'invite-user-popup.component.html'
})
export class InviteUserPopupComponent extends AbstractUpsertEntityModalDirective<any> {
  private readonly client = inject(UsersClient);

  readonly statuses = UserStatusOptions;
  readonly roles = RoleOptions;

  @Input() labels!: Record<'label' | 'save', string>;
  readonly searchTerm$ = new BehaviorSubject<string>('');

  @Input() set user(value: TUser | null) {
    if (!value) return;

    this.upsertForm.controls.email.disable();
    this.upsertForm.patchValue(value);
  }

  readonly upsertForm = this.fb.group<ControlsOf<TRegisterRequest & { id: string }>>({
    id: this.fb.control(''),
    email: this.fb.control(null as unknown as string, [trimRequiredValidator, emailValidator()]),
    phone: this.fb.control('', []),
    password: this.fb.control('', [trimRequiredValidator, strongPasswordValidator(true)]),
    firstName: this.fb.control('', [trimRequiredValidator, FIELD_MAX_LENGTH]),
    lastName: this.fb.control('', [FIELD_MAX_LENGTH]),
    role: this.fb.control(ERole.Employee, [FIELD_MAX_LENGTH]),
  });
  readonly formControlNames = getFormControlsNames(this.upsertForm);

  $filteredUsers = signal<TUserListControl>({
    entities: [],
    page: 1,
    isLastPage: false
  });

  constructor() {
    super();

    this.listenSearchChanges();
  }

  readonly $isUserExist = toSignal(this.upsertForm.controls.id.valueChanges.pipe(map((id) => Boolean(id))));

  private readonly passwordValidators = [trimRequiredValidator, strongPasswordValidator(true)];

  selectUser(user: TUser | string) {
    console.log(user);
    if (!user) return;

    if (typeof user === 'string') {
      this.upsertForm.controls.password.setValidators(this.passwordValidators);
      this.upsertForm.patchValue({ email: user, id: '' });
      this.upsertForm.controls.password.updateValueAndValidity();
      return;
    }

    this.upsertForm.controls.password.clearValidators();
    this.upsertForm.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      id: user.id,
    });
    this.upsertForm.controls.password.updateValueAndValidity();
    console.log(this.upsertForm);
  }

  private listenSearchChanges() {
    this.searchTerm$
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((term) => this.getUsers(term, 1)),
          takeUntilDestroyed()
        )
        .subscribe((installers) => {
          this.$filteredUsers.set({ entities: installers, page: 1, isLastPage: false });
        });
  }

  private getUsers(query: string, page: number) {
    return this.client.getList({ email: query })
               .pipe(
                 map((response) => response.collection)
               );
  }

  protected readonly PHONE_MASK = PHONE_MASK;
}
