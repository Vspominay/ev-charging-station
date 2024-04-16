import { inject } from '@angular/core';

import { ResolveFn } from '@angular/router';
import { DepotDashboardFacade } from '@features/depot/data-access/depot-dashboard.facade';
import { of } from 'rxjs';

export const depotDashboardLoader: ResolveFn<null> = (route) => {
  const depotId = route.params['depotId'];

  if (!depotId) {
    throw new Error(`Please provide depotId in the route params 😊`);
  }

  inject(DepotDashboardFacade).selectDepot(depotId);

  return of(null);
};
