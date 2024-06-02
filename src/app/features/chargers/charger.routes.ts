import { Routes } from '@angular/router';
import { loadChargerDetails } from '@features/chargers/data-access/resolvers/load-charger-details.resolver';
import { chargingProfilesLoader } from '@features/charging-profiles/data-access/resolvers/charging-profiles.resolver';

export const ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@features/chargers/ui/components/charger-list/charger-list.component')
  },
  {
    path: ':chargerId',
    children: [
      {
        path: '',
        redirectTo: 'view',
        pathMatch: 'full'
      },
      {
        path: 'view',
        resolve: [loadChargerDetails, chargingProfilesLoader],
        loadComponent: () => import('./ui/components/charger-details/charger-details.component')
      }
    ]
  }
];
