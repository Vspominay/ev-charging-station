import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject, makeEnvironmentProviders
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig, withViewTransitions } from '@angular/router';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { tokenInterceptor } from '@core/interceptors/token.interceptor';
import { translateProvider } from '@core/providers/translate.provider';
import { AuthFacade } from '@features/auth/data-access/auth.facade';
import { SessionStore } from '@features/auth/data-access/session.store';
import { ChargersStore } from '@features/chargers/data-access/chargers.store';
import { ChargingProfileStore } from '@features/charging-profiles/data-access/charging-profile.store';
import { DepotStore } from '@features/depot/data-access/depot.store';
import { OcppTagStore } from '@features/ocpp-tags/data-access/ocpp.store';
import { ReservationStore } from '@features/reservations/data-access/reservation.store';
import { UserStore } from '@features/users/data-access/users.store';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { FlatpickrModule } from 'angularx-flatpickr';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { of } from 'rxjs';

import { routes } from './app.routes';

export const provideFlatPicker = () => {
  return makeEnvironmentProviders(FlatpickrModule.forRoot().providers!);
};

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (authFacade = inject(AuthFacade)) => {
        authFacade.restoreSession();

        return () => of(true);
      },
      multi: true
    },
    provideRouter(routes, withViewTransitions(), withComponentInputBinding(), withRouterConfig({
      paramsInheritanceStrategy: 'always'
    })),
    provideHttpClient(
      withInterceptors([tokenInterceptor, errorInterceptor])
    ),
    importProvidersFrom(translateProvider),
    provideEnvironmentNgxMask(),
    DepotStore,
    OcppTagStore,
    UserStore,
    ReservationStore,
    ChargersStore,
    ChargingProfileStore,
    SessionStore,
    provideFlatPicker(),
    provideIonicAngular({}),

  ],
};
