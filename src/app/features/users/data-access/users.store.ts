import { inject, InjectionToken } from '@angular/core';
import { createGenericStore } from '@core/abstractions/base-store.store';
import { TUser, TUserUpsert } from '@features/users/data-access/models/user.type';
import { UsersClient } from '@features/users/data-access/users.client';

export const USERS_CLIENT_GATEWAY = new InjectionToken('USERS_CLIENT_GATEWAY', {
  providedIn: 'root',
  factory: () => inject(UsersClient)
});

export const UserStore = createGenericStore<TUser, TUserUpsert>(
  USERS_CLIENT_GATEWAY,
  'User'
);
