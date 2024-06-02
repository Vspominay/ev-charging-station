import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { EnergyConsumptionFacade } from '@features/depot/data-access/facades/energy-consumption.facade';
import { of } from 'rxjs';

export const depotConfigurationResolver: ResolveFn<null> = (route: ActivatedRouteSnapshot) => {
  const depotId = route.params['depotId'];
  const depotConfigFacade = inject(EnergyConsumptionFacade);

  depotConfigFacade.loadConfig(depotId);

  return of(null);
};
