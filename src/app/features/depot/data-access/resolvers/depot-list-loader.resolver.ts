import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DepotListFacade } from '@features/depot/data-access/depot-list.facade';
import { of } from 'rxjs';

export const depotListLoader: ResolveFn<null> = () => {
  inject(DepotListFacade).searchDepots('');

  return of(null);
};
