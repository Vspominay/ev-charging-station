import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '@core/services/notification.service';
import { AuthFacade } from '@features/auth/data-access/auth.facade';
import { catchError, EMPTY, from } from 'rxjs';
import { map } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacade = inject(AuthFacade);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authFacade.logout();
        return EMPTY;
      }

      return from(notificationService.showServerError(error.error))
        .pipe(map(() => {
          throw error;
        }));
    })
  );
};
