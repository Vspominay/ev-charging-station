import { TitleCasePipe } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { emailValidator } from '@core/validators/email.validator';
import { FIELD_MAX_LENGTH } from '@core/validators/field-max-length.validators';
import { trimRequiredValidator } from '@core/validators/trim-required.validator';
import { ERole } from '@features/auth/data-access/models/roles.enum';
import { $ocppTags } from '@features/ocpp-tags/data-access/utils/get-all-ocpp-tags.util';
import { RoleOptions, UserStatusOptions } from '@features/users/constants/user.constants';
import { TUser, TUserUpsert } from '@features/users/data-access/models/user.type';
import { UsersClient } from '@features/users/data-access/users.client';
import { UserLabelPipe } from '@features/users/ui/pipes/user-label.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractUpsertEntityModalDirective } from '@shared/components/abstract-upsert-entity-modal.directive';
import { FormElementModule } from '@shared/components/form-control/form-control.module';
import { IconDirective } from '@shared/directives/icon.directive';
import { getFormControlsNames } from '@shared/utils/get-form-controls-names.util';
import { ControlsOf } from '@shared/utils/types/controls-of.type';
import { FlatpickrModule } from 'angularx-flatpickr';
import dayjs from 'dayjs';
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
    TitleCasePipe
  ],
  templateUrl: 'invite-user-popup.component.html'
})
export class InviteUserPopupComponent extends AbstractUpsertEntityModalDirective<any> {
  private readonly client = inject(UsersClient);

  readonly statuses = UserStatusOptions;
  readonly roles = RoleOptions;

  readonly $ocppTags = $ocppTags();

  @Input() labels!: Record<'label' | 'save', string>;
  readonly searchTerm$ = new BehaviorSubject<string>('');

  @Input() set user(value: TUser | null) {
    if (!value) return;

    this.upsertForm.controls.email.disable();
    this.upsertForm.patchValue(value);
  }

  readonly upsertForm = this.fb.group<ControlsOf<TUserUpsert>>({
    id: this.fb.control('', []),
    email: this.fb.control(null as unknown as string, [trimRequiredValidator, emailValidator()]),
    firstName: this.fb.control('', [trimRequiredValidator, FIELD_MAX_LENGTH]),
    lastName: this.fb.control('', [FIELD_MAX_LENGTH]),
    ocppTagId: this.fb.control(null as unknown as string, [Validators.required]),
    role: this.fb.control(ERole.Employee, [Validators.required]),
    expiration: this.fb.control(dayjs().add(6, 'months').toISOString()),
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

  selectUser(user: TUser | string) {
    console.log(user);
    if (!user) return;

    if (typeof user === 'string') {
      this.upsertForm.patchValue({ email: user });
      return;
    }

    this.upsertForm.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName || ''
    });
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
}
