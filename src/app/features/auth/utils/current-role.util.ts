import { computed, inject, Signal } from '@angular/core';
import { ERole } from '@features/auth/data-access/models/roles.enum';
import { SessionStore } from '@features/auth/data-access/session.store';

export const $currentRole = (): Signal<Array<ERole>> => {
  const user = inject(SessionStore).user;

  return computed(() => user().roles);
};
