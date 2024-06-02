import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthFacade } from '@features/auth/data-access/auth.facade';
import { catchError, EMPTY, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacade = inject(AuthFacade);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authFacade.logout();
        return EMPTY;
      }

      return throwError(error);
    })
  );
};
