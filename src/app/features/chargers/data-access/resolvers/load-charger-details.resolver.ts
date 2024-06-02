import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ChargersFacade } from '@features/chargers/data-access/chargers.facade';
import { of } from 'rxjs';

export const loadChargerDetails: ResolveFn<null> = (route) => {
  const chargerId = route.params['chargerId'];
  const chargerFacade = inject(ChargersFacade);

  chargerFacade.loadCharger(chargerId);


  return of(null);
};
