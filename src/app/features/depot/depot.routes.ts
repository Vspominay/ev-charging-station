import { Routes } from '@angular/router';
import { depotDashboardLoader } from '@features/depot/data-access/resolvers/depot-dashboard.resolver';
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
];

export default ROUTES;
