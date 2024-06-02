import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionStore } from '@features/auth/data-access/session.store';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const $token = inject(SessionStore).token;

  return $token() ? next(req.clone({ setHeaders: { Authorization: `Bearer ${$token()}` } })) : next(req);
};
