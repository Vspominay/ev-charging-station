import { inject } from '@angular/core';
import { DepotDashboardFacade } from '@features/depot/data-access/depot-dashboard.facade';

export const depotId = () => {
  return inject(DepotDashboardFacade).$viewModel().depot?.id;
};
