import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { translateProvider } from '@core/providers/translate.provider';
import { OcppTagStore } from '@features/ocpp-tags/data-access/ocpp.store';
import { FlatpickrModule } from 'angularx-flatpickr';

import { routes } from './app.routes';
import { DepotStore } from './features/depot/data-access/depot.store';

export const provideFlatPicker = () => {
  return makeEnvironmentProviders(FlatpickrModule.forRoot().providers!);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(),
    importProvidersFrom(translateProvider),
    DepotStore,
    OcppTagStore,
    provideFlatPicker()
  ],
};
