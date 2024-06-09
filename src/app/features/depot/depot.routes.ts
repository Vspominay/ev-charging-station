import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { CHARGERS_CLIENT_GATEWAY } from '@features/chargers/data-access/chargers.store';
import { depotConfigurationResolver } from '@features/depot/data-access/resolvers/depot-configuration.resolver';
import { depotDashboardLoader } from '@features/depot/data-access/resolvers/depot-dashboard.resolver';
import { OcppTagStore } from '@features/ocpp-tags/data-access/ocpp.store';
import { ReservationStore } from '@features/reservations/data-access/reservation.store';
import { UsersFacade } from '@features/users/data-access/users.facade';
import { of, take } from 'rxjs';
import { depotListLoader } from './data-access/resolvers/depot-list-loader.resolver';

const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    resolve: {
      list: depotListLoader
    },
    // canMatch: [hasRoleGuard([ERole.Administrator, ERole.SuperAdministrator])],
    loadComponent: () => import('./ui/components/depot-list/depot-list.component')
  },
  {
    path: ':depotId',
    resolve: {
      depot: depotDashboardLoader,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./ui/components/depot-dashboard/depot-dashboard.component'),
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'chargers'
          },
          {
            path: 'chargers',
            loadChildren: () => import('@features/chargers/charger.routes').then((r) => r.ROUTES)
          },
          {
            path: 'stats',
            loadComponent: () => import('@features/statistics/ui/components/stats-root/stats-root.component')
          }
        ]
      },
      {
        path: 'chargers',
        loadChildren: () => import('@features/chargers/charger.routes').then((r) => r.ROUTES)
      },
      {
        path: 'ocpp-tags',
        resolve: {
          list: () => {
            inject(OcppTagStore).loadAll({});

            return of([]);
          }
        },
        loadComponent: () => import('@features/ocpp-tags/ui/components/ocpp-tag-list/ocpp-tag-list.component')
      },
      {
        path: 'reservations',
        resolve: {
          list: (route: ActivatedRouteSnapshot) => {
            const depotId = route.params['depotId'];
            inject(ReservationStore).loadAll({});
            inject(CHARGERS_CLIENT_GATEWAY).getListByDepots([depotId])
                                           .pipe(take(1))
                                           .subscribe((stations) => {
                                             console.log(stations);
                                           });

            console.log('load reservations');

            return of([]);
          }
        },
        loadComponent: () => import('@features/reservations/ui/components/calendar/calendar.component')
      },
      {
        path: 'configuration',
        resolve: [depotConfigurationResolver],
        loadComponent: () => import('@features/depot/ui/components/depot-configuration/depot-configuration.component')
      },
      {
        path: 'users',
        resolve: {
          list: () => {
            inject(UsersFacade).search();
          }
        },
        loadComponent: () => import('@features/users/ui/components/users.component')
      },
    ]
  },
];

export default ROUTES;
