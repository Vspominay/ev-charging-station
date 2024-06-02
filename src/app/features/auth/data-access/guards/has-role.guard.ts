import { computed, inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthFacade } from '@features/auth/data-access/auth.facade';
import { ERole } from '@features/auth/data-access/models/roles.enum';
import { hasRole } from '@shared/utils/has-role.util';

export const hasRoleGuard = (neededRoles: ERole | Array<ERole>): CanMatchFn => () => {
  const router = inject(Router);
  const authFacade = inject(AuthFacade);
  const $role = computed(() => authFacade.$vm().user.role);

  return hasRole($role(), neededRoles) || router.createUrlTree(['auth', 'login']);
};
