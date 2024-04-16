import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { translateProvider } from '@core/providers/translate.provider';

import { routes } from './app.routes';
import { DepotStore } from './features/depot/data-access/depot.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(),
    importProvidersFrom(translateProvider),
    DepotStore
  ]
};
