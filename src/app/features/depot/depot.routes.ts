import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { depotDashboardLoader } from '@features/depot/data-access/resolvers/depot-dashboard.resolver';
import { OcppTagStore } from '@features/ocpp-tags/data-access/ocpp.store';
import { of } from 'rxjs';
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
            loadComponent: () => import('@features/chargers/ui/components/charger-list/charger-list.component')
          },
          {
            path: 'stats',
            loadComponent: () => import('@features/statistics/ui/components/stats-root/stats-root.component')
          }
        ]
      },
      {
        path: 'ocpp-tags',
        resolve: {
          list: () => {
            inject(OcppTagStore).loadAll('');

            return of([]);
          }
        },
        loadComponent: () => import('@features/ocpp-tags/ui/components/ocpp-tag-list/ocpp-tag-list.component')
      },
    ]
  },
];

export default ROUTES;
