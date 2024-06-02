import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '@features/auth/data-access/session.store';

export const hasToken: CanActivateFn = () => {
  const router = inject(Router);
  const $token = inject(SessionStore).token;

  return Boolean($token()) || router.createUrlTree(['auth', 'login']);
};
